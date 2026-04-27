import { PasswordReset } from "@/pages/passwordReset/PasswordReset"

const passwordReset = {
    path: "password-resets/:email/:token",
    element: <PasswordReset />
}

export default passwordReset
