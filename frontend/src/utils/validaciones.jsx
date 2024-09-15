export const validarContraseña = (contraseña) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/|\\~`-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;"'<>,.?/|\\~`-]{8,}$/;
  return regex.test(contraseña);
};

export const validarEmailDocente = (email) => {
  const regexDocente = /^[a-zA-Z0-9._%+-]+@fcyt\.umss\.edu\.bo$/;
  return regexDocente.test(email);
};

export const validarEmailEstudiante = (email) => {
  const regexEstudiante = /^[0-9]{9}@est\.umss\.edu$/;
  return regexEstudiante.test(email);
};