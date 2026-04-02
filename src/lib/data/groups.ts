import type { CommunityGroup } from "@/types/group";

export const GROUPS: CommunityGroup[] = [
  {
    _id: "group-1",
    name: {
      fr: "Étude biblique adultes",
      pt: "Estudo bíblico adultos",
      en: "Adult Bible Study",
    },
    description: {
      fr: "Un temps d'étude approfondie de la Bible, de partage et de prière pour les adultes.",
      pt: "Um tempo de estudo aprofundado da Bíblia, partilha e oração para adultos.",
      en: "A time of in-depth Bible study, sharing and prayer for adults.",
    },
    groupType: "bible_study",
    leaderName: "Paulo Sicoli",
    meetingDay: "wednesday",
    meetingTime: "20:00",
    locationId: "loc-saint-hippolyte",
    active: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    _id: "group-2",
    name: {
      fr: "Groupe de jeunes",
      pt: "Grupo de jovens",
      en: "Youth Group",
    },
    description: {
      fr: "Rencontres dynamiques pour les 15-25 ans : jeux, louange, étude biblique et convivialité.",
      pt: "Encontros dinâmicos para jovens de 15-25 anos: jogos, louvor, estudo bíblico e convívio.",
      en: "Dynamic meetings for ages 15-25: games, worship, Bible study and fellowship.",
    },
    groupType: "youth",
    leaderName: "Pierre Moreau",
    meetingDay: "friday",
    meetingTime: "19:30",
    locationId: "loc-saint-hippolyte",
    active: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    _id: "group-3",
    name: {
      fr: "Groupe de prière",
      pt: "Grupo de oração",
      en: "Prayer Group",
    },
    description: {
      fr: "Un temps de prière communautaire pour intercéder ensemble pour notre communauté et le monde.",
      pt: "Um tempo de oração comunitária para interceder juntos pela nossa comunidade e pelo mundo.",
      en: "A time of community prayer to intercede together for our community and the world.",
    },
    groupType: "prayer",
    leaderName: "Marie-Claire Fontaine",
    meetingDay: "tuesday",
    meetingTime: "19:00",
    locationId: "loc-saint-hippolyte",
    active: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    _id: "group-4",
    name: {
      fr: "Groupe de louange",
      pt: "Grupo de louvor",
      en: "Worship Team",
    },
    description: {
      fr: "Répétitions et formation pour l'équipe de louange. Musiciens et chanteurs bienvenus.",
      pt: "Ensaios e formação para a equipe de louvor. Músicos e cantores são bem-vindos.",
      en: "Rehearsals and training for the worship team. Musicians and singers welcome.",
    },
    groupType: "worship",
    leaderName: "Marie-Claire Fontaine",
    meetingDay: "saturday",
    meetingTime: "15:00",
    locationId: "loc-saint-hippolyte",
    active: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
];

export function getGroups(): CommunityGroup[] {
  return GROUPS.filter((g) => g.active);
}

export function getGroupById(id: string): CommunityGroup | null {
  return GROUPS.find((g) => g._id === id) ?? null;
}
