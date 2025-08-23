import { PrismaClient, DocType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de seeding...');

  // --- CREACIÓN DE PERMISOS (sin cambios) ---
  const permissionsToCreate = [
    // ... tu lista de permisos es correcta, la dejamos igual
    { action: 'role:create', description: 'Crear roles' },
    { action: 'role:read', description: 'Leer roles' },
    { action: 'role:update', description: 'Actualizar roles' },
    { action: 'role:delete', description: 'Eliminar roles' },
    { action: 'role:assign', description: 'Asignar roles' },
    { action: 'role:revoke', description: 'Revocar roles' },
    { action: 'company:create', description: 'Crear empresas' },
    { action: 'company:read', description: 'Leer empresas' },
    { action: 'company:update', description: 'Actualizar empresas' },
    { action: 'company:delete', description: 'Eliminar empresas' },
    { action: 'user:create', description: 'Crear usuarios' },
    { action: 'user:read', description: 'Leer usuarios' },
    { action: 'user:update', description: 'Actualizar usuarios' },
    { action: 'user:delete', description: 'Eliminar usuarios' },
    { action: 'user:delegate', description: 'Tener un delegado' },
    { action: 'parameters:update', description: 'Actualizar parámetros' },
    { action: 'contract:create', description: 'Crear contratos' },
    { action: 'contract:read', description: 'Leer contratos' },
    { action: 'contract:update', description: 'Actualizar contratos' },
    { action: 'contract:delete', description: 'Eliminar contratos' },
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

  // --- CREACIÓN DE MENÚS (sin cambios) ---
  // Tu lógica para crear menús es correcta, la dejamos igual.
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
      'No se encontraron los permisos necesarios para crear los menús.',
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
    await prisma.menu.create({ data: menu });
  }
  console.log('Menús creados exitosamente.');

  // --- CREACIÓN DE LA EMPRESA "MADRE" (sin cambios) ---
  console.log('Creando la empresa eGescon...');
  const company = await prisma.company.upsert({
    where: { nit: '900.123.456-7' },
    update: {},
    create: {
      name: 'eGescon',
      nit: '900.123.456-7',
    },
  });
  console.log(`Empresa creada/encontrada con ID: ${company.id}`);

  // --- NUEVO: CREACIÓN DEL ROL "SUPER ADMIN" ---
  console.log('Creando el rol de Super Administrador...');
  const superAdminRole = await prisma.role.create({
    data: {
      name: 'Super Admin',
      description: 'Rol con todos los permisos del sistema.',
      companyId: company.id,
    },
  });
  console.log(`Rol Super Admin creado con ID: ${superAdminRole.id}`);

  console.log('Asignando todos los permisos al rol Super Admin...');
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    });
  }
  console.log('Todos los permisos han sido asignados al rol Super Admin.');

  console.log('Creando el usuario administrador...');
  const hashedPassword = await bcrypt.hash('ContrasenaSegura123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@egescon.com' },
    update: {},
    create: {
      docType: DocType.CC,
      docNum: '1020304050',
      name: 'Administrador eGescon',
      email: 'admin@egescon.com',
      password: hashedPassword,
      isActive: true,
      companyId: company.id,
      roleId: superAdminRole.id,
    },
  });
  console.log(
    `Usuario administrador creado/encontrado con ID: ${adminUser.id} y rol Super Admin.`,
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
