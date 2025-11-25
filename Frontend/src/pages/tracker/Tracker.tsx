import { useEffect, useState, type JSX } from "react";
import { AnimatePresence, motion, spring } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRightFromBracket, faLock, faMagnifyingGlass, faSun, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import { userData } from "@/lib/userData";
import { Files, XIcon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { TrackerNavbar } from "@/components/TrackerNavbar";


export function Tracker(): JSX.Element {
    const [ isOut, setIsOut ] = useState<boolean>(false)
    const [ pendapatanUrl, setPendapatanUrl ] = useState<string | null>(null)
    const [ pengeluaranUrl, setPengeluaranUrl ] = useState<string | null>(null)
    const [ today, setToday ] = useState<string | null>(null)

    useEffect(() => {
        const t = new Date()
        const year = t.getFullYear()
        const month = String(t.getMonth() + 1).padStart(2, "0")
        const day = String(t.getDate()).padStart(2, "0")

        setToday(`${year}-${month}-${day}`)
    }, [])


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
            <TrackerNavbar setIsOut={setIsOut} isOut={isOut} backLink="/app" trackerName="My New Tracker" />
            <AnimatePresence>
                {!isOut && <motion.div
                    key={"main"}
                    className="flex flex-col items-center mt-15 w-[87%] gap-8"
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
                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full">
                            <p className="font-normal text-sm">Saldo kamu:</p>
                            <p className="font-semibold text-xl">Rp.3.750.000</p>
                        </div>
                        <div className="w-full">
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
                        </div>
                        <div className="flex justify-between w-full gap-5">
                            <Dialog>
                                <DialogTrigger className="flex-1 w-full">
                                    <motion.div whileTap={{ scale: 0.95 }}><Button className="flex-1 w-full bg-white border-2 border-green-300 text-neutral-800" onClick={() => setPendapatanUrl(null)} >+ Pendapatan</Button></motion.div>
                                </DialogTrigger>
                                <DialogContent className="flex flex-col shadow-green-300/40">
                                    <DialogTitle className="font-medium">Pendapatan</DialogTitle>
                                    <DialogDescription className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Input placeholder="Judul" />
                                            <Input placeholder="Deskripsi (opsional)" />
                                            <div className="flex flex-row gap-2 mt-2">
                                                <Input type="file" onChange={(e) => {
                                                    const file = e.target.files
                                                    console.log(e.target.files)
                                                    if(file?.length === 0) {
                                                        setPendapatanUrl(null)
                                                    }
                                                    if(file?.length === 1) {
                                                        const allowed = ["image/jpeg", "image/png", "image/jpg"]
                                                        const isAllowed = allowed.includes(file[0].type)

                                                        isAllowed && setPendapatanUrl(URL.createObjectURL(file[0]))
                                                    }
                                                }} />
                                                <Input type="date" defaultValue={today ? today : undefined} />
                                            </div>
                                            <img src={pendapatanUrl ? pendapatanUrl : undefined} alt="" className="w-[50%] max-h-40 rounded-md" />
                                        </div>
                                        <Button className="bg-transparent border-2 border-green-300 text-black font-[Inter] font-semibold">Tambah</Button>
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger className="flex-1 w-full">
                                    <motion.div whileTap={{ scale: 0.95 }}><Button className="flex-1 w-full bg-white border-2 border-red-300 text-neutral-800">- Pengeluaran</Button></motion.div>
                                </DialogTrigger>
                                <DialogContent className="flex flex-col shadow-red-300/40">
                                    <DialogTitle className="font-medium">Pengeluaran</DialogTitle>
                                    <DialogDescription className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Input placeholder="Judul" />
                                            <Input placeholder="Deskripsi (opsional)" />
                                            <div className="flex flex-row gap-2 mt-2">
                                                <Input type="file" onChange={(e) => {
                                                    const file = e.target.files
                                                    console.log(e.target.files)
                                                    if(file?.length === 0) {
                                                        setPengeluaranUrl(null)
                                                    }
                                                    if(file?.length === 1) {
                                                        const allowed = ["image/jpeg", "image/png", "image/jpg"]
                                                        const isAllowed = allowed.includes(file[0].type)

                                                        isAllowed && setPengeluaranUrl(URL.createObjectURL(file[0]))
                                                    }
                                                }} />
                                                <Input type="date" defaultValue={today ? today : undefined} />
                                            </div>
                                            <img src={pengeluaranUrl ? pengeluaranUrl : undefined} alt="" className="w-[50%] max-h-40 rounded-md" />
                                        </div>
                                        <Button className="bg-transparent border-2 border-red-300 text-black font-[Inter] font-semibold">Tambah</Button>
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="w-full flex flex-col gap-7">
                            <div className="flex flex-col w-full">
                                <div className="flex justify-between items-center w-full">
                                    <p className="font-medium text-base">Riwayat Pengeluaran</p>
                                    <Button onClick={() => {setIsOut(true); setTimeout(() => window.location.href = "/app/tracker/history", 400)}} className="bg-white border-2 border-neutral-200 text-neutral-800 font-medium h-8">Lihat</Button>
                                </div>
                                <div className="flex justify-between items-center border-b py-3">
                                    <div className="flex flex-col">
                                        <p className="font-normal text-[15px]">Gajian</p>
                                        <p className="font-normal text-sm text-neutral-600">2 hari lalu</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">+ Rp.2.500.000</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-b py-3">
                                    <div className="flex flex-col">
                                        <p className="font-normal text-[15px]">Jajan</p>
                                        <p className="font-normal text-sm text-neutral-600">5 hari lalu</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">- Rp.100.000</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-b py-3">
                                    <div className="flex flex-col">
                                        <p className="font-normal text-[15px]">Nemu duit</p>
                                        <p className="font-normal text-sm text-neutral-600">2 minggu lalu</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">- Rp.2.000</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-full gap-4 h-full">
                                <div className="flex justify-between items-center w-full">
                                    <p className="font-medium text-base">Laporan & Insight</p>
                                    <Button onClick={() => {setIsOut(true); setTimeout(() => window.location.href = "/app/tracker/report", 400)}} className="bg-white border-2 border-neutral-200 text-neutral-800 font-medium h-8">Lihat</Button>
                                </div>
                                <div className="flex flex-row gap-2 h-full">
                                    <div className="flex flex-row gap-2 overflow-hidden w-full">
                                        <div className="bg-white w-fit px-4 py-3 border rounded-lg flex-1">
                                            <p className="font-normal text-sm">Pemasukkan</p>
                                            <p className="font-medium text-lg">Rp. 235.000</p>
                                        </div>
                                        <div className="bg-white w-fit px-4 py-3 border rounded-lg flex-1">
                                            <p className="font-normal text-sm">Pengeluaran</p>
                                            <p className="font-medium text-lg">Rp. 450.350</p>
                                        </div>
                                        <div className="bg-white w-fit px-4 py-3 border rounded-lg flex-1">
                                            <p className="font-normal text-sm text-nowrap">Saldo akhir</p>
                                            <p className="font-medium text-lg text-nowrap">Rp. 450.350</p>
                                        </div>
                                        <div className="absolute w-20 h-25 left-[calc(100vw-100px)] bg-linear-to-l from-background-primary to-transparent" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>}
            </AnimatePresence>  
        </section>
    )
}