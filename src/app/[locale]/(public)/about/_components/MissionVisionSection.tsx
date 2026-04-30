import { getTranslations } from "next-intl/server";
import { PeekRectangle } from "@/_components/PeekRectangle";
import { SkeletonImage } from "@/_components/SkeletonImage";
import {
  MicrophoneBold,
  FlameBold,
  UsersGroupRoundedBold,
  DiplomaBold,
  HandHeartBold,
  InfinityBold,
} from "solar-icon-set";
import { CrossDivider } from "@/_components/CrossDivider";
import { TextParagraphs } from "@/_components/TextParagraphs";

const COMMITMENT_ICONS = [
  MicrophoneBold,
  FlameBold,
  UsersGroupRoundedBold,
  DiplomaBold,
  HandHeartBold,
  InfinityBold,
];

type Commitment = { title: string; description: string };

export async function MissionVisionSection() {
  const t = await getTranslations("about");

  const commitments = t.raw("missionCommitments") as Commitment[];

  return (
    <section className="bg-parchment pb-10 pt-20 md:pb-28 md:pt-52">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-12 md:grid md:grid-cols-[520px_1fr] md:items-start md:gap-14">

          {/* Left — photo */}
          <div className="order-first">
            <PeekRectangle color="bordeaux" position="bottom-right">
              <SkeletonImage
                src="https://erelachapelle.dzign-e.app/broto-nature.jpg"
                alt=""
                width={1080}
                height={1440}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, 380px"
              />
            </PeekRectangle>
          </div>

          {/* Right — content */}
          <div>
            <h3 className="mt-3 pb-4 font-serif font-bold text-night-bordeaux-2 text-center md:text-justify">
              {t("mission")}
            </h3>
            <CrossDivider variant="burgundy" className="justify-center" />
            <TextParagraphs
              text={t("missionText")}
              className="mt-6 leading-relaxed text-coffee-bean text-justify"
            />

            {/* Commitment grid — same structure as ValuesSection */}
            <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {commitments.map((item, index) => {
                const Icon = COMMITMENT_ICONS[index];
                return (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-5 border-l-2 border-toffee-brown/25 py-1 pl-6"
                  >
                    <div className="shrink-0 md:pt-0.5">
                      <Icon size={22} color="var(--toffee-brown)" />
                    </div>
                    <div>
                      <h6 className="font-serif font-bold text-carbon-black">
                        {item.title}
                      </h6>
                      <p className="mt-1.5 leading-relaxed text-coffee-bean text-justify">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-10 border-t border-dust-grey pt-6 text-sm italic leading-relaxed text-coffee-bean/70">
              {t("missionClosing")}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
