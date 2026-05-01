import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type JSX } from "react";
import { useLocation, useParams } from "react-router-dom";
import { boolean } from "zod";

export function NewLocation(): JSX.Element {
    const { email, token } = useParams<{ email: string; token: string }>();
    const { search } = useLocation()
    const [isOut, setIsOut] = useState<boolean>(false)
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ status, setStatus ] = useState<"none" | "error" | "ok">("none")
    const [ errorMsg, setErrorMsg ] = useState<string>("")

    if (!email || !token || !search || search == "") window.location.href = "/"

    useEffect(() => {
        console.log("email :", email)
        console.log("token :", token)
        console.log("search :", search)
    }, [])

    return (
        <section>
            <AnimatePresence>
                {!isOut && <motion.div
                    key={"navbar"}
                    className="w-full h-screen flex justify-center items-center z-10 top-0 left-0"
                    initial={{
                        x: 30,
                        opacity: 0,
                    }}
                    animate={{
                        x: 0,
                        opacity: 100,
                        transition: {
                            delay: 0.3
                        }
                    }}
                    exit={{
                        x: -30,
                        opacity: 0
                    }}
                >
                    <div className="flex flex-col items-center gap-3 -mt-5 px-5">
                        <FontAwesomeIcon icon={faPencil} className="text-6xl text-stone-900"></FontAwesomeIcon>
                        <h1 className="text-2xl font-bold text-stone-900 dark:text-background-primary">Device Login Request</h1>
                        <p className="text-base text-stone-600 dark:text-stone-400 text-center">We receive a new device login request to {email}. <br/> If this isn't you, change your password immediately.</p>
                        <Button className="mt-3 bg-transparent border-red-500 border-3 text-red-500 font-semibold w-40 sm:w-60">Allow Login</Button>
                        <div>Saving changes <Spinner/></div>
                    </div>
                </motion.div>}
            </AnimatePresence>
        </section>
    )
}