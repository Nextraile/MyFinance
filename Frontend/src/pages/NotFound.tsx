import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Frown, XIcon } from "lucide-react";
import type { JSX } from "react";
import { Link } from "react-router-dom";

export function NotFound(): JSX.Element {
  return (
    <Empty className="font-[inter] flex justify-center items-center w-screen h-screen -mt-10">
        <EmptyHeader>
            <EmptyMedia variant="default">
                <XIcon size={100} />
            </EmptyMedia>
            <EmptyTitle className="font-semibold text-[24px]">
                Pages Not Found!
            </EmptyTitle>
        </EmptyHeader>
        <EmptyDescription className="font-medium text-[16px]">
            Looks like the page you're looking for is nonexistent, <br/>
            consider returning to the <Link to={"/app"}>dashboard.</Link> 
        </EmptyDescription>
    </Empty>
  )
}
