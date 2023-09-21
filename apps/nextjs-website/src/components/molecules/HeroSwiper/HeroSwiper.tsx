'use client';
import React, { useCallback, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import NavigationArrow from '@/components/atoms/NavigationArrow/NavigationArrow';
import CtaSlide, { CtaSlideProps } from '@/components/atoms/CtaSlide/CtaSlide';
import { Swiper as SwiperCore } from 'swiper';

export type HeroSwiperProps = {
  cards: CtaSlideProps[];
};

const HeroSwiper = ({ cards }: HeroSwiperProps) => {
  const [swiperCore, setSwiperCore] = useState<SwiperCore>();
  const [swiperIndex, setSwiperIndex] = useState(0);

  const nextSlide = useCallback(() => {
    swiperCore?.slideNext();
  }, [swiperCore]);

  const previousSlide = useCallback(() => {
    swiperCore?.slidePrev();
  }, [swiperCore]);

  return (
    <Swiper
      onInit={(swiper) => {
        setSwiperCore(swiper);
      }}
      initialSlide={swiperIndex}
      onActiveIndexChange={(swiperCore) => {
        setSwiperIndex(swiperCore.activeIndex);
      }}
      pagination={{ clickable: true }}
      loop={true}
      modules={[Navigation, Pagination]}
    >
      <div onClick={() => previousSlide()}>
        <NavigationArrow direction={'left'} hidden={false} />
      </div>
      <div onClick={() => nextSlide()}>
        <NavigationArrow direction={'right'} hidden={false} />
      </div>
      {cards.map((props, index) => (
        <SwiperSlide key={index}>
          <CtaSlide {...props} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSwiper;
