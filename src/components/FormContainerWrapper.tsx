// components/FormContainerWrapper.tsx
import FormContainer, { FormContainerProps } from "./FormContainer";

// This is a Server Component (no "use client")
export default function FormContainerWrapper(props: FormContainerProps) {
  return <FormContainer {...props} />;
}
