// components/email/VerificationEmail.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface VerificationEmailProps {
  name?: string | null;
  verificationURL: string;
}


function VerificationEmail({ name = 'John Cena', verificationURL }: VerificationEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Verify Email</Preview>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white mx-auto my-12 px-8 py-12 rounded-lg shadow-lg max-w-xl">
            <Heading className="text-3xl font-bold text-center text-gray-900 mb-6">
              Welcome{name ? `, ${name}` : ''}!
            </Heading>

            <Text className="text-lg text-gray-700 mb-8 text-center">
              Thanks for signing up. Please verify your email address to get started.
            </Text>

            <Section className="text-center mb-10">
              <Button
                href={verificationURL}
                className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg text-lg"
              >
                Verify Email Address
              </Button>
            </Section>

            <Text className="text-sm text-gray-600 text-center">
              Or copy and paste this link into your browser:
              <br />
              <a href={verificationURL} className="text-blue-600 break-all">
                {verificationURL}
              </a>
            </Text>

            <Text className="text-xs text-gray-500 mt-10 text-center">
              This link expires in 1 hour. If you didn't create an account, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default VerificationEmail