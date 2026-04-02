import type { LeadershipMember } from "@/types/leader";

export const LEADERSHIP_TEAM: LeadershipMember[] = [
  {
    _id: "leader-1",
    fullName: "Pasteur Paulo Sicoli",
    photoUrl: "/chase-kennedy-ueXAnDZgnr4-unsplash.jpg",
    role: {
      fr: "Pasteur principal",
      pt: "Pastor principal",
      en: "Senior Pastor",
    },
    bio: {
      fr: "Pasteur Paulo dirige notre communauté depuis 2015. Passionné par l'enseignement biblique et l'accompagnement pastoral.",
      pt: "Pastor Paulo lidera nossa comunidade desde 2015. Apaixonado pelo ensino bíblico e acompanhamento pastoral.",
      en: "Pastor Paulo has led our community since 2015. Passionate about biblical teaching and pastoral care.",
    },
    email: "paulo@erelachapelle.fr",
    ministryAreas: ["teaching", "pastoral-care", "leadership"],
    order: 1,
    active: true,
  },
  {
    _id: "leader-2",
    fullName: "Marie-Claire Fontaine",
    photoUrl: "/chase-kennedy-ueXAnDZgnr4-unsplash.jpg",
    role: {
      fr: "Responsable louange",
      pt: "Responsável pelo louvor",
      en: "Worship Leader",
    },
    bio: {
      fr: "Marie-Claire anime les temps de louange et dirige l'équipe musicale dans nos trois localisations.",
      pt: "Marie-Claire conduz os momentos de louvor e dirige a equipe musical em nossas três localizações.",
      en: "Marie-Claire leads worship and directs the music team across our three locations.",
    },
    email: "marieclaire@erelachapelle.fr",
    ministryAreas: ["worship", "music"],
    order: 2,
    active: false,
  },
  {
    _id: "leader-3",
    fullName: "Pierre Moreau",
    photoUrl: "/chase-kennedy-ueXAnDZgnr4-unsplash.jpg",
    role: {
      fr: "Responsable jeunesse",
      pt: "Responsável pela juventude",
      en: "Youth Leader",
    },
    bio: {
      fr: "Pierre accompagne les jeunes de la communauté avec dynamisme et bienveillance, organisant activités et études bibliques.",
      pt: "Pierre acompanha os jovens da comunidade com dinamismo e bondade, organizando atividades e estudos bíblicos.",
      en: "Pierre mentors the community's youth with energy and care, organizing activities and Bible studies.",
    },
    email: "pierre@erelachapelle.fr",
    ministryAreas: ["youth", "activities"],
    order: 3,
    active: false,
  },
];

export function getLeadershipTeam(): LeadershipMember[] {
  return LEADERSHIP_TEAM.filter((m) => m.active).sort(
    (a, b) => a.order - b.order
  );
}
