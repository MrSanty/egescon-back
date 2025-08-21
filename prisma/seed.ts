import { PrismaClient, DocType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de seeding...');

  const permissionsToCreate = [
    // --- GESTIÓN DE ROLES ---
    { action: 'role:create', description: 'Crear roles' },
    { action: 'role:read', description: 'Leer roles' },
    { action: 'role:update', description: 'Actualizar roles' },
    { action: 'role:delete', description: 'Eliminar roles' },
    { action: 'role:assign', description: 'Asignar roles' },
    { action: 'role:revoke', description: 'Revocar roles' },

    // --- EMPRESA ---
    { action: 'company:create', description: 'Crear empresas' },
    { action: 'company:read', description: 'Leer empresas' },
    { action: 'company:update', description: 'Actualizar empresas' },
    { action: 'company:delete', description: 'Eliminar empresas' },

    // --- GESTIÓN DE USUARIOS ---
    { action: 'user:create', description: 'Crear usuarios' },
    { action: 'user:read', description: 'Leer usuarios' },
    { action: 'user:update', description: 'Actualizar usuarios' },
    { action: 'user:delete', description: 'Eliminar usuarios' },
    { action: 'user:delegate', description: 'Tener un delegado' },

    // --- GESTIÓN DE PARAMETROS ---
    { action: 'parameters:update', description: 'Actualizar parámetros' },

    // --- GESTION DE CONTRATOS ---
    { action: 'contract:create', description: 'Crear contratos' },
    { action: 'contract:read', description: 'Leer contratos' },
    { action: 'contract:update', description: 'Actualizar contratos' },
    { action: 'contract:delete', description: 'Eliminar contratos' },

    // --- GESTION DE INFORMES ---
    { action: 'reports:create', description: 'Crear informes' },
    { action: 'reports:read', description: 'Leer informes' },
    { action: 'reports:update', description: 'Actualizar informes' },
    { action: 'reports:delete', description: 'Eliminar informes' },
    { action: 'reports:approve', description: 'Aprobar informes' },
  ];

  console.log('Creando permisos...');
  for (const p of permissionsToCreate) {
    await prisma.permission.upsert({
      where: { action: p.action },
      update: {},
      create: p,
    });
  }
  console.log('Permisos creados exitosamente.');

  console.log('Consultando permisos para los menús...');
  const userReadPermission = await prisma.permission.findUnique({
    where: { action: 'user:read' },
  });
  const companyReadPermission = await prisma.permission.findUnique({
    where: { action: 'company:read' },
  });
  const roleReadPermission = await prisma.permission.findUnique({
    where: { action: 'role:read' },
  });
  const paramsUpdatePermission = await prisma.permission.findUnique({
    where: { action: 'parameters:update' },
  });
  const contractReadPermission = await prisma.permission.findUnique({
    where: { action: 'contract:read' },
  });
  const reportsReadPermission = await prisma.permission.findUnique({
    where: { action: 'reports:read' },
  });

  if (
    !userReadPermission ||
    !companyReadPermission ||
    !roleReadPermission ||
    !paramsUpdatePermission ||
    !contractReadPermission ||
    !reportsReadPermission
  ) {
    throw new Error(
      'No se encontraron los permisos necesarios para crear los menús. Asegúrate de que están definidos en permissionsToCreate.',
    );
  }

  console.log('Creando los menús...');
  await prisma.menu.deleteMany({});

  const menusToCreate = [
    {
      name: 'Contratos',
      icon: 'file-text',
      permissionId: contractReadPermission.id,
      parent: 'Ejecución',
    },
    {
      name: 'Informes',
      icon: 'bar-chart',
      permissionId: reportsReadPermission.id,
      parent: 'Ejecución',
    },

    {
      name: 'Usuarios',
      icon: 'users',
      permissionId: userReadPermission.id,
      parent: 'Configuración',
    },
    {
      name: 'Empresas',
      icon: 'building',
      permissionId: companyReadPermission.id,
      parent: 'Configuración',
    },

    {
      name: 'Roles',
      icon: 'shield',
      permissionId: roleReadPermission.id,
      parent: 'Configuración',
    },
    {
      name: 'Parámetros',
      icon: 'cog',
      permissionId: paramsUpdatePermission.id,
      parent: 'Configuración',
    },
  ];

  for (const menu of menusToCreate) {
    await prisma.menu.create({
      data: menu,
    });
  }
  console.log('Menús creados exitosamente.');

  console.log('Creando la empresa eGescon...');
  const company = await prisma.company.create({
    data: {
      name: 'eGescon',
      nit: '900.123.456-7',
    },
  });
  console.log(`Empresa creada con ID: ${company.id}`);

  console.log('Creando el usuario administrador...');
  const hashedPassword = await bcrypt.hash('ContrasenaSegura123!', 10);

  const user = await prisma.user.create({
    data: {
      docType: DocType.CC,
      docNum: '1020304050',
      name: 'Administrador eGescon',
      email: 'admin@egescon.com',
      password: hashedPassword,
      isActive: true,
      companyId: company.id,
    },
  });
  console.log(
    `Usuario creado con ID: ${user.id} para la empresa ${company.name}`,
  );

  console.log('Seeding finalizado exitosamente!');
}

main()
  .catch((e) => {
    console.error('Ha ocurrido un error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
