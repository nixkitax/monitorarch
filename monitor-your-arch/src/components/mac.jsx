import Image from 'next/image';

export default function Mac() {
    return (
        <div className="relative w-full h-full rounded-lg">
            <Image
                src="COMPUTER.png"
                alt="Macbook"
                width={1000}
                height={1000}
                priority
            />
        </div>
    );
};