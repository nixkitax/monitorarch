"use client";
//TODO: FROM STATIC CARDS TO DYNAMIC CARDS
import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const storedName = localStorage.getItem("userName");
      if (!storedName) {
        setIsDrawerOpen(true);
      } else {
        setName(storedName);
        setIsVisible(true);
      }
    }
  }, [isMounted]);

  const verifyName = () => {
    const storedName = localStorage.getItem("userName");
    if (storedName && storedName === name) {
      return true;
    }
    return false;
  };

  const handleDrawerSubmit = () => {
    if (name) {
      localStorage.setItem("userName", name);
      if (verifyName()) {
        setIsDrawerOpen(false);
        setIsVisible(true);
      } else {
        alert("There was an error saving your name. Please try again.");
      }
    } else {
      alert("Please enter your name");
    }
  };

  if (!isVisible) {
    return (
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Welcome, this is MonitorArch! {`What's`} your name? 🥰
            </DrawerTitle>
            <DrawerDescription>
              You can take care of your architecture here!
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 mb-4 border border-gray-300 rounded w-full"
            />
          </div>
          <DrawerFooter>
            <Button variant="outline" onClick={handleDrawerSubmit}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16 ">
      <div className="flex flex-col w-full just gap-12">
        <div className="flex-1 flex-col items-center justify-center">
          <div className="flex-1 flex-col -mx-10 -my-14">
            <div>
              <p className="font-normal text-xl"> Hello, </p>
            </div>
            <div>
              <p className="font-medium text-xl">
                {" "}
                {localStorage.getItem("userName")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div>
            <p className="font-medium text-xl pb-3"> What you can do here..</p>
          </div>
          <div className="flex justify-center">
            <Carousel
              className="w-full ml-24 "
              plugins={[
                Autoplay({
                  delay: 5000,
                }),
              ]}
            >
              <CarouselContent className="-ml-1">
                <CarouselItem
                  key={"paolo"}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-2xl font-semibold">ciao</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                <CarouselItem
                  key={"paolo"}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-2xl font-semibold">ciao</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                <CarouselItem
                  key={"paolo"}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square p-6">
                        <div className="flex flex-col">
                          <span className="text-2xl font-semibold">
                            Real-time network chart
                          </span>
                          <p>Ciao</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                <CarouselItem
                  key={"paolo"}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-2xl font-semibold">ciao</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div>
            <p className="font-medium text-xl pb-3"> What you can do here..</p>
          </div>
          <div className="flex justify-center">
            <Carousel
              className="w-full ml-24 "
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
            >
              <CarouselContent className="-ml-1">
                <CarouselItem
                  key={"paolo"}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-2xl font-semibold">ciao</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                <CarouselItem
                  key={"paolo"}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-2xl font-semibold">ciao</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                <CarouselItem
                  key={"paolo"}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square p-6">
                        <div className="flex flex-col">
                          <span className="text-2xl font-semibold">
                            Real-time network chart
                          </span>
                          <p>Ciao</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                <CarouselItem
                  key={"paolo"}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-2xl font-semibold">ciao</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </main>
  );
}
