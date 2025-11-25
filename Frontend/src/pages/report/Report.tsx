import { useEffect, useState, type JSX } from "react";
import { AnimatePresence, motion, MotionConfig, spring, useScroll } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRightFromBracket, faDollar, faFilter, faLock, faSun, faTriangleExclamation, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { userData } from "@/lib/userData";
import { XIcon } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { TrackerNavbar } from "@/components/TrackerNavbar";

export function Report(): JSX.Element {
    const [ range, setRange ] = useState<number>(7)
    const [ isOut, setIsOut ] = useState<boolean>(false)

    const chartData = [
    { date: "11/2/25", desktop: 2200700 },
    { date: "11/3/25", desktop: 2300750 },
    { date: "11/2/25", desktop: 2320000 },
    { date: "11/2/25", desktop: 2100000 },
    { date: "11/2/25", desktop: 1950000 },
    ]
    const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
    } satisfies ChartConfig

    return (
        <section className="flex flex-col items-center">
            <TrackerNavbar setIsOut={setIsOut} isOut={isOut} trackerName="My New Tracker" backLink="/app/tracker" />
            <AnimatePresence>
                {!isOut && <motion.div
                    className="w-full flex flex-col items-center"
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
                    <div className="mt-18 mb-3 flex flex-row justify-between w-fit gap-4 relative">
                        {[
                            { value: 7, label: "7 hari" },
                            { value: 30, label: "30 hari" },
                            { value: 365, label: "1 tahun" }
                        ].map(item => (
                            <button
                                key={item.value}
                                onClick={() => setRange(item.value)}
                                className="relative px-3 py-1 rounded-full backdrop-blur-[2px] text-sm font-medium text-neutral-800"
                            >
                                {range === item.value && (
                                    <motion.div
                                        className="absolute inset-0 bg-green-300/50 rounded-full"
                                        layoutId="active-pill"
                                    />
                                )}
                                <span className="relative z-10">{item.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col items-center w-[87%] gap-3">
                        <div className="flex justify-between w-full">
                            <h3 className="text-sm font-regular">Laporan & Insight</h3>
                        </div>
                        <div className="w-full flex flex-col gap-3.5">
                            <div className="bg-white flex flex-col w-full justify-center items-start p-4 rounded-xl">
                                <p className="font-normal text-base">Saldo Akhir</p>
                                <p className="font-medium text-lg">Rp.3.796.105</p>
                            </div>
                            <div className="flex flex-row gap-3.5">
                                <div className="bg-white flex flex-col w-full justify-center items-start p-4 rounded-xl gap-1 h-fit">
                                    <div className="flex flex-col">
                                        <p className="font-normal text-base">Pemasukkan</p>
                                        <p className="font-medium text-lg">Rp.406.105</p>
                                    </div>
                                    <p className="text-sm font-normal text-neutral-600">- 12% dari bulan lalu</p>
                                </div>
                                <div className="bg-white flex flex-col w-full justify-center items-start p-4 rounded-xl gap-1 h-fit">
                                    <div className="flex flex-col">
                                        <p className="font-normal text-base">Pengeluaran</p>
                                        <p className="font-medium text-lg">Rp.738.067</p>
                                    </div>
                                    <p className="text-sm font-normal text-neutral-600">+ 6% dari bulan lalu</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-white p-3 rounded-xl">
                            <ChartContainer config={chartConfig}>
                                <AreaChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                    left: 10,
                                    right: 10,
                                    top: 10 ,
                                    bottom: 10
                                    }}
                
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={6}
                                        tickFormatter={value => value}
                                    />
                                    <YAxis
                                        domain={['dataMin - 50000', 'dataMax + 50000']}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={false}
                                        width={0}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="line" />}
                                    />
                                    <Area
                                        dataKey="desktop"
                                        type='natural'
                                        fill="#16E716"
                                        fillOpacity={0.2}
                                        stroke="#16E716"
                                    />
                                </AreaChart>
                            </ChartContainer>
                            <div className="flex flex-col gap-3 px-3">
                                <div className="flex justify-start items-center gap-2">
                                    <FontAwesomeIcon icon={faDollar} className="text-green-600/70" />
                                    <p className="text-sm font-normal text-neutral-700">Pemasukkan terbanyak Rp.12.000 di hari sabtu</p>
                                </div>
                                <div className="flex justify-start items-center gap-2">
                                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500/80" />
                                    <p className="text-sm font-normal text-neutral-700">Pengeluaran terbanyak ada di makanan</p>
                                </div>
                                <div className="flex justify-start items-center gap-2">
                                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500/80" />
                                    <p className="text-sm font-normal text-neutral-700">Pengeluaran terbanyak Rp.35.000 di hari rabu</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-2 mt-2">
                            <h3 className="text-sm font-regular">Riwayat dalam rentang 7 hari</h3>
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
                            <motion.div
                                className="w-full bg-background-primary flex justify-center items-center h-15"
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
                            </motion.div>
                        </div>
                    </div>
                </motion.div>}
            </AnimatePresence>
        </section>
    )
}