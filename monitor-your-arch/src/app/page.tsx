"use client";

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
import Banner from "@/components/banner";
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
      <div className="flex flex-col w-full just gap-12 ">
        <div className="flex-1 flex-col items-center justify-center">
          <div className="flex-1 flex-col -mx-10 -mb-5 -my-10 ">
            <div>
              <p className="font-normal text-xl">
                Welcome back {localStorage.getItem("userName")}
                <p className="font-medium text-xl"></p>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div>
            <p className="font-medium text-xl pb-3">
              {" "}
              What can I do with MonitorArch?
            </p>
          </div>
          <div className="flex justify-center">
            <Carousel
              className="w-full  "
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
                      <CardContent className="flex aspect-square p-6">
                        <div className="flex flex-col">
                          <span className="text-2xl font-semibold">
                            Real-time network chart
                          </span>
                          <p className="mt-6">
                            You can check the network traffic in real time
                            selecting your network interface! 🥰
                          </p>
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
                      <CardContent className="flex aspect-square p-6">
                        <div className="flex flex-col">
                          <span className="text-2xl font-semibold">
                            Real-time network chart
                          </span>
                          <p className="mt-6">
                            You can check the network traffic in real time
                            selecting your network interface! 🥰
                          </p>
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
                      <CardContent className="flex aspect-square p-6">
                        <div className="flex flex-col">
                          <span className="text-2xl font-semibold">
                            Register your network sessions
                          </span>
                          <p className="mt-6">
                            You can register network sessions to analyze them
                            when you're chilling!
                          </p>
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
          <div className="my-6">
            <Banner />
          </div>
        </div>
      </div>
    </main>
  );
}
