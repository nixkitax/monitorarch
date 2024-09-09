import Image from "next/image"
export default function Banner() {
    return (
        <div>
            <Image className="rounded-lg" src="/banner.png" alt="banner" width={1000} height={800} />
        </div>
    )
}
;