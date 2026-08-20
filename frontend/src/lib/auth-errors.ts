export function mapAuthError(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/invalid-email":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Correo o contraseña incorrectos.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta de nuevo más tarde.";
    case "auth/account-exists-with-different-credential":
      return "Ya existe una cuenta con ese correo usando otro método de inicio de sesión.";
    default:
      return "No se pudo iniciar sesión. Intenta de nuevo.";
  }
}

export function authErrorCode(err: unknown): string {
  return err instanceof Error && "code" in err ? String((err as { code: string }).code) : "";
}
