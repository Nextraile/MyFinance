import { faClone } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState, type JSX } from "react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { AnimatePresence, motion } from "motion/react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function Transfer(): JSX.Element {
    const [ isTransfer, setIsTransfer ] = useState<boolean>(false)

    // template for automated cut
    const tittle = "My Personal Tracker"
    const desc = "This is my own tracker for tracking my financial"

    const mainContent = (
        <motion.div 
        className="flex flex-col items-center sm:w-85 w-[75%] gap-5"
        layout
        >
            <motion.div>
                <AnimatePresence mode="wait">
                    {!isTransfer && 
                        <motion.div
                        key="pre-transfer"
                            initial={{
                                x: 30,
                                opacity: 0
                            }}
                            animate={{
                                x: 0,
                                opacity: 100
                            }}
                            exit={{
                                x: 30,
                                opacity: 0
                            }}
                            >
                            <FontAwesomeIcon
                                icon={faClone}
                                className="text-7xl"
                            />
                        </motion.div>
                    }
                    {isTransfer && 
                        <motion.div
                        key="in-transfer"
                        initial={{
                            x: -30,
                            opacity: 0
                        }}
                        animate={{
                            x: 0,
                            opacity: 100
                        }}
                        exit={{
                            x: -30,
                            opacity: 0
                        }}
                        >
                            <FontAwesomeIcon
                                icon={faClone}
                                className="text-7xl"
                            />
                        </motion.div>
                    }
                </AnimatePresence>
            </motion.div>
            <motion.div
                className="flex flex-col items-center gap-6"
                layout
            >
                <motion.div className="flex flex-col items-center text-center gap-2.5">
                    <AnimatePresence mode="wait">
                        {!isTransfer && <motion.h1 
                            key="pre-transfer"
                            className={`self-stretch text-center justify-start text-stone-900 text-2xl font-semibold`}
                            initial={{
                                x: -30,
                                opacity: 0
                            }}
                            animate={{
                                x: 0,
                                opacity: 100
                            }}
                            exit={{
                                x: -30,
                                opacity: 0
                            }}
                            >
                            Local Data Found!
                        </motion.h1>}
                        {isTransfer && <motion.h1 
                            key="in-transfer"
                            className={`self-stretch text-center justify-start text-stone-900 text-2xl font-semibold`}
                            initial={{
                                x: 30,
                                opacity: 0
                            }}
                            animate={{
                                x: 0,
                                opacity: 100
                            }}
                            exit={{
                                x: 30,
                                opacity: 0
                            }}
                            >
                            Choose What to Transfer!
                        </motion.h1>}
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                        {!isTransfer &&
                            <motion.p
                            key="pre-transfer"
                            className="text-stone-900 text-base font-normal font-['Inter']"
                            initial={{
                                x: -30,
                                opacity: 0
                            }}
                            animate={{
                                x: 0,
                                opacity: 100
                            }}
                            exit={{
                                x: -30,
                                opacity: 0
                            }}
                            >
                                To keep your data synced, transfer your local data to
                                <b className="text-stone-900 text-base font-medium font-['Inter']"> MyCloud </b>
                                now
                            </motion.p>
                        }
                        {isTransfer && 
                        <motion.div
                        key="in-transfer"
                        className="w-full flex flex-col gap-2"
                        initial={{
                                x: 30,
                                opacity: 0
                            }}
                            animate={{
                                x: 0,
                                opacity: 100
                            }}
                            exit={{
                                x: 30,
                                opacity: 0
                            }}
                            >
                            <motion.div className="w-full h-18 border-3 rounded-md border-stone-300 text-left flex justify-between items-center px-3 py-3">
                                <div className="flex flex-col">
                                    <p className="text-stone-900/60 font-medium text-lg">
                                    {
                                        tittle.split("").map((char, i) => (
                                            i < 20 ? char : null
                                        ))
                                    }
                                    {
                                        tittle.length > 20 && "..."
                                    }
                                    </p>
                                    <p className="font-normal text-base text-zinc-600/60">
                                        {
                                            desc.split("").map((char, i) => (
                                                i < 29 ? char : null
                                            ))
                                        }
                                        {
                                            desc.length > 27 && "..."
                                        }
                                    </p>
                                </div>
                                <div className="h-full">
                                    <div className="h-3.5 w-3.5 border-stone-300 border-3 rounded-full" />
                                </div>
                            </motion.div>
                            <motion.div className="w-full h-18 border-3 rounded-md border-stone-300 text-left flex justify-between items-center px-3 py-3">
                                <div className="flex flex-col">
                                    <p className="text-stone-900/60 font-medium text-lg">
                                    {
                                        tittle.split("").map((char, i) => (
                                            i < 20 ? char : null
                                        ))
                                    }
                                    {
                                        tittle.length > 20 && "..."
                                    }
                                    </p>
                                    <p className="font-normal text-base text-zinc-600/60">
                                        {
                                            desc.split("").map((char, i) => (
                                                i < 29 ? char : null
                                            ))
                                        }
                                        {
                                            desc.length > 27 && "..."
                                        }
                                    </p>
                                </div>
                                <div className="h-full">
                                    <div className="h-3.5 w-3.5 border-stone-300 border-3 rounded-full" />
                                </div>
                            </motion.div>
                            <motion.div className="w-full h-18 border-3 rounded-md border-stone-300 text-left flex justify-between items-center px-3 py-3">
                                <div className="flex flex-col">
                                    <p className="text-stone-900/60 font-medium text-lg">
                                    {
                                        tittle.split("").map((char, i) => (
                                            i < 20 ? char : null
                                        ))
                                    }
                                    {
                                        tittle.length > 20 && "..."
                                    }
                                    </p>
                                    <p className="font-normal text-base text-zinc-600/60">
                                        {
                                            desc.split("").map((char, i) => (
                                                i < 29 ? char : null
                                            ))
                                        }
                                        {
                                            desc.length > 27 && "..."
                                        }
                                    </p>
                                </div>
                                <div className="h-full">
                                    <div className="h-3.5 w-3.5 border-stone-300 border-3 rounded-full" />
                                </div>
                            </motion.div>
                        </motion.div>}
                    </AnimatePresence>
                </motion.div>
                <motion.div className="flex flex-col gap-1.5 w-full">
                    <motion.div className="flex flex-row gap-6 w-full">
                        {/* !isTransfer */}
                        <AnimatePresence mode="wait">
                            {!isTransfer &&
                                <AlertDialog>
                                    <AlertDialogTrigger className="flex-1 flex">
                                        <motion.button
                                            key="pre-transfer1"
                                            className={`bg-transparent h-9 flex-1 grow border-3 border-red-500 text-center flex justify-center text-base text-red-500 font-medium font-['Inter'] hover:bg-transparent hover:border-red-600 hover:text-red-600 items-center rounded-md`}
                                            initial={{
                                                x: -30,
                                                opacity: 0
                                            }}
                                            animate={{
                                                x: 0,
                                                opacity: 100
                                            }}
                                            exit={{
                                                x: 30,
                                                opacity: 0
                                            }}
                                        >
                                            Start Clean
                                        </motion.button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This action will give you a fresh <span className="font-semibold">MyCloud</span> account and will <span className="font-semibold">permanently delete</span> your local data.</AlertDialogDescription>
                                            <AlertDialogDescription>Consider transfering your data instead. <br/> <span className="font-semibold">We are not responsible for any data loss by doing this action.</span></AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Let me think...</AlertDialogCancel>
                                            <AlertDialogAction>Yes, Im Sure</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            }
                            {!isTransfer &&
                                <motion.button
                                key="pre-transfer2"
                                onClick={() => setIsTransfer(true)}
                                className={`text-center flex-1 h-9 items-center rounded-md grow text-neutral-900 flex justify-center [background-image:var(--color-button-primary)] text-base font-medium`}
                                initial={{
                                    x: -30,
                                    opacity: 0
                                }}
                                animate={{
                                    x: 0,
                                    opacity: 100
                                }}
                                exit={{
                                    x: 30,
                                    opacity: 0
                                }}
                                >
                                    Transfer Data
                                </motion.button>
                            }
                            {/* isTrnsfer */}
                            {isTransfer && 
                                <motion.button
                                key="in-transfer1"
                                onClick={() => setIsTransfer(false)} 
                                className={`bg-transparent items-center h-9 rounded-md flex-1 grow border-3 border-red-500 text-center flex justify-center text-base text-red-500 font-medium font-['Inter'] hover:bg-transparent hover:border-red-600 hover:text-red-600`}
                                initial={{
                                    x: -30,
                                    opacity: 0
                                }}
                                animate={{
                                    x: 0,
                                    opacity: 100
                                }}
                                exit={{
                                    x: -30,
                                    opacity: 0
                                }}
                                >
                                    Cancel
                                </motion.button>
                            }
                            {isTransfer && 
                                <motion.button 
                                key="in-transfer2"
                                className={`text-center items-center rounded-md h-9 flex-1 grow text-neutral-900 flex justify-center [background-image:var(--color-button-primary)] text-base font-medium`}
                                initial={{
                                    x: -30,
                                    opacity: 0
                                    }}
                                    animate={{
                                        x: 0,
                                        opacity: 100
                                    }}
                                    exit={{
                                        x: -30,
                                        opacity: 0
                                    }}
                                    >
                                    Begin Transfer
                                </motion.button>
                            }
                        </AnimatePresence>
                    </motion.div>
                    <AnimatePresence mode="wait">
                        {!isTransfer &&
                            <motion.div
                            key="pre-transfer"
                            className="flex items-center justify-start gap-0.5"
                            initial={{
                                y: -20,
                                opacity: 0
                            }}
                            animate={{
                                y: 0,
                                opacity: 100,
                                transition: {
                                    delay: 0.6,
                                }
                            }}
                            exit={{
                                y: 20,
                                opacity: 0
                            }}
                            >
                                <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500" />
                                <p className="justify-start text-red-500 text-[14px] font-medium">This will erase your data</p>
                            </motion.div>
                        }
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </motion.div>
    )

    return (
        <section className="flex justify-center items-center min-h-screen -mt-5">
            {mainContent}
        </section>
    )
}
