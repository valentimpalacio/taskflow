
fetch("https://taskflow-liard-rho.vercel.app/en", { redirect: "manual" })
  .then(r => {
    console.log("Status /en:", r.status);
    return r.text();
  })
  .then(text => {
    const hasError = text.includes("somethingWentWrong") || text.includes("Something went wrong");
    console.log("Has error page:", hasError);
    const hasSignin = text.includes("signin") || text.includes("Sign in");
    console.log("Has signin content:", hasSignin);
  })
  .catch(e => console.error(e));

fetch("https://taskflow-liard-rho.vercel.app/en/auth/signin", { redirect: "manual" })
  .then(r => {
    console.log("Status /en/auth/signin:", r.status);
  })
  .catch(e => console.error(e));
