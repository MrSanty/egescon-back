import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

// Define las propiedades que tu componente de correo recibirá
interface WelcomeEmailProps {
  name: string;
  email: string;
  password?: string; // La contraseña es opcional por si se usa para otros fines
}

// URL del logo de tu empresa. Reemplázala por la tuya.
const logoUrl = 'https://yt3.googleusercontent.com/ytc/AIdro_k-90a2rR13_402n_I392j-v_8z-w_Z-w_Z-w=s900-c-k-c0x00ffffff-no-rj';

export const WelcomeEmail = ({
  name = 'Juan Pérez',
  email = 'juan.perez@example.com',
  password = 'temp-password-1234',
}: WelcomeEmailProps) => {
  const previewText = `¡Bienvenido a eGesCon, ${name}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                'brand-teal': '#0D9488', // Un color teal profesional para eGesCon
                'brand-dark': '#18181B', // Un gris oscuro para el texto
              },
              fontFamily: {
                sans: [ '"Inter"', 'sans-serif' ],
              },
            },
          },
        }}
      >
        <Body className="bg-gray-100 my-auto mx-auto font-sans">
          <Container className="border border-solid border-gray-200 rounded-lg my-10 mx-auto p-10 bg-white max-w-2xl">

            {/* Sección del Encabezado con el Logo */}
            <Section className="mt-8">
              {/* <Img
                src={logoUrl}
                width="120"
                height="auto"
                alt="eGesCon Logo"
                className="my-0 mx-auto"
              /> */}
            </Section>

            {/* Título Principal */}
            <Section className="text-center mt-8">
              <Text className="text-brand-dark text-2xl font-bold">
                ¡Bienvenido a eGesCon!
              </Text>
            </Section>

            {/* Contenido Principal */}
            <Section className="mt-8">
              <Text className="text-brand-dark text-base">
                Hola <b>{name}</b>,
              </Text>
              <Text className="text-gray-600 text-base leading-6">
                Estamos encantados de tenerte a bordo. Se ha creado una cuenta para ti en la plataforma de gestión de contratos eGesCon. A continuación, encontrarás tus credenciales de acceso.
              </Text>
            </Section>

            {/* Sección de Credenciales */}
            <Section className="bg-gray-50 border border-solid border-gray-200 rounded-md p-6 my-8 text-center">
              <Text className="text-gray-600 text-sm">Tu correo electrónico:</Text>
              <Text className="text-brand-dark font-semibold text-base tracking-wider">{email}</Text>
              <Text className="text-gray-600 text-sm mt-2">Tu contraseña temporal:</Text>
              <Text className="text-brand-dark font-semibold text-base tracking-wider">{password}</Text>
            </Section>

            {/* Llamada a la Acción (Botón) */}
            <Section className="text-center mt-8">
              <Text className="text-gray-600 text-base leading-6 mb-6">
                Por tu seguridad, esta contraseña es temporal. Por favor, inicia sesión y cámbiala lo antes posible.
              </Text>
              <Button
                className="bg-brand-teal text-white font-semibold rounded-md py-3 px-8 text-base"
                href="http://localhost:3000/login"
              >
                Ir a Iniciar Sesión
              </Button>
            </Section>

            {/* Pie de Página */}
            <Hr className="border border-solid border-gray-200 my-10" />
            <Section>
              <Text className="text-gray-500 text-xs text-center">
                © {new Date().getFullYear()} eGesCon. Todos los derechos reservados.
              </Text>
              <Text className="text-gray-500 text-xs text-center">
                eGesCon S.A.S, Manizales, Colombia.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
