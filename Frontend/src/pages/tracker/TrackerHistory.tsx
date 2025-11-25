import { useState, type JSX } from "react";
import { AnimatePresence, motion, spring } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRightFromBracket, faFilter, faLock, faSun, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { userData } from "@/lib/userData";
import { XIcon } from "lucide-react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrackerNavbar } from "@/components/TrackerNavbar";

export function TrackerHistory(): JSX.Element {
    const [ isOut, setIsOut ] = useState<boolean>(false)
    const [ isAccountOpen, setIsAccountOpen ] = useState<boolean>(false)
    const [ direction, setDirection ] = useState("desc")
    const [ showPlus, setShowPlus ] = useState(true)
    const [ showwMinus, setShowMinus ] = useState(true)

    return (
        <section className="flex flex-col items-center">
            <TrackerNavbar trackerName="My New Navbar" setIsOut={setIsOut} isOut={isOut} backLink="/app/tracker"  />
            <AnimatePresence>
                {!isOut && <motion.div
                    key={"tracker-history"}
                    className="flex flex-col items-center mt-18 w-[87%] gap-3"
                    initial={{
                        x: 30,
                        opacity: 0,
                        // filter: "blur(5px)"
                    }}
                    animate={{
                        x: 0,
                        opacity: 100,
                        // filter: "blur(0px)",
                        transition: {
                            delay: 0.4
                        }
                    }}
                    exit={{
                        x: -30,
                        opacity: 0,
                        transition: {
                            delay: 0.1
                        }
                    }}
                >
                    <div className="flex justify-between w-full">
                        <h3 className="text-sm font-regular">Riwayat finansial</h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <FontAwesomeIcon icon={faFilter} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white/50 backdrop-blur-[2px] w-45 mr-5">
                                <DropdownMenuRadioGroup value={direction} onValueChange={setDirection}>
                                    <DropdownMenuRadioItem value="asc">Naik</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="desc">Turun</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                checked={showPlus}
                                onCheckedChange={setShowPlus}
                                >
                                Pengeluaran
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                checked={showwMinus}
                                onCheckedChange={setShowMinus}
                                >
                                Pemasukkan
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="w-full flex flex-col gap-2 mb-15">
                        <Dialog>
                            <DialogTrigger className="flex w-full bg-white rounded-md">
                                <div className="w-20 bg-neutral-400 rounded-l-md" />
                                <div className="flex w-full text-start justify-between flex-1 p-3">
                                    <div className="flex flex-col w-full pb-5 gap-0.5">
                                        <div className="flex w-full flex-col flex-1">
                                            <p className="text-sm font-normal">Gajian</p>
                                            <p className="font-semibold text-base">+ Rp. 4.200.000</p>
                                        </div>
                                    </div>
                                    <div className="self-end flex-1 font-normal text-xs text-neutral-500">11/4/25</div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="w-full flex flex-col items-center">
                                <div className="w-[calc(100vw-70px)] h-70 sm:w-full bg-neutral-300" />
                                <div className="flex w-full flex-row justify-between items-end">
                                    <h4 className="font-medium text-xl">Gajian</h4>
                                    <p className="font-semibold text-2xl text-neutral-600">+ Rp. 4.200.000</p>
                                </div>
                                <p className="text-sm font-normal text-neutral-400 self-end">Kamis, 11 October 2025</p>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger className="flex w-full bg-white rounded-md">
                                <div className="w-20 bg-neutral-400 rounded-l-md" />
                                <div className="flex w-full text-start justify-between flex-1 p-3">
                                    <div className="flex flex-col w-full pb-5 gap-0.5">
                                        <div className="flex w-full flex-col flex-1">
                                            <p className="text-sm font-normal">Jajan</p>
                                            <p className="font-semibold text-base">- Rp. 20.000</p>
                                        </div>
                                        <p className="font-normal w-full text-sm text-neutral-700">Ini contoh deskrips..</p>
                                    </div>
                                    <div className="self-end flex-1 font-normal text-xs text-neutral-500">11/2/25</div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="w-full flex flex-col items-center">
                                <div className="w-[calc(100vw-70px)] h-70 sm:w-full bg-neutral-300" />
                                <div className="flex w-full flex-row justify-between items-end">
                                    <h4 className="font-medium text-xl">Jajan</h4>
                                    <p className="font-semibold text-2xl text-neutral-600">- Rp.100.000</p>
                                </div>
                                <p className="text-base font-normal">Ini contoh deskripsi yang sangat sangat panjaang sekali. Lorem dolor sit amet.</p>
                                <p className="text-sm font-normal text-neutral-400 self-end">Kamis, 11 October 2025</p>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger className="flex w-full bg-white rounded-md">
                                <div className="flex w-full text-start justify-between flex-1 p-3">
                                    <div className="flex flex-col w-full pb-5 gap-0.5">
                                        <div className="flex w-full flex-col flex-1">
                                            <p className="text-sm font-normal shrink">Bayar sewaan</p>
                                            <p className="font-semibold text-base shrink-0 ">- Rp.2.676.000</p>
                                        </div>
                                    </div>
                                    <div className="self-end flex-1 font-normal text-xs text-neutral-500">11/2/25</div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="w-full flex flex-col items-center">
                                <div className="flex w-full flex-row justify-between items-end">
                                    <h4 className="font-medium text-xl">Bayar Sewaan</h4>
                                    <p className="font-semibold text-2xl text-neutral-600">- Rp.2.676.000</p>
                                </div>
                                <p className="text-sm font-normal text-neutral-400 self-end">Kamis, 11 October 2025</p>
                            </DialogContent>
                        </Dialog>
                    </div>
                </motion.div>}
                {!isOut && <motion.div
                    className="w-full bg-background-primary flex justify-center items-center h-15 fixed bottom-0"
                    initial={{
                        x: 30,
                        opacity: 0,
                        // filter: "blur(5px)"
                    }}
                    animate={{
                        x: 0,
                        opacity: 100,
                        // filter: "blur(0px)",
                        transition: {
                            delay: 0.4
                        }
                    }}
                    exit={{
                        x: -30,
                        opacity: 0,
                        transition: {
                            delay: 0.1
                        }
                    }}
                >
                    <Pagination className="relative">
                    <PaginationContent className="relative">
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive className="bg-green-400/60 text-white">
                                2
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                    </Pagination>
                </motion.div>}
            </AnimatePresence>
        </section>
    )
}