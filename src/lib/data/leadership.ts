import type { LeadershipMember } from "@/types/leader";

export const LEADERSHIP_TEAM: LeadershipMember[] = [
  {
    _id: "paulo-sicoli",
    slug: "paulo-sicoli",
    fullName: "Paulo Sicoli",
    photoUrl: "/images/paulo-sicoli.jpg",
    role: {
      fr: "Pasteur",
      pt: "Pastor",
      en: "Pastor",
    },
    bio: {
      fr: "Missionnaire brésilien en Europe depuis 2004, Paulo Sicoli est pasteur de l'Église Réformée Évangélique La Chapelle, à Saint-Hippolyte-du-Fort. Envoyé par l'APMT et partenaire de l'UNEPREF, il consacre son ministère à l'enseignement, l'accompagnement pastoral et l'implantation d'églises.",
      pt: "Missionário brasileiro na Europa desde 2004, Paulo Sicoli é pastor da Igreja Reformada Evangélica La Chapelle, em Saint-Hippolyte-du-Fort. Enviado pela APMT e em parceria com a UNEPREF, dedica seu ministério ao ensino, ao acompanhamento pastoral e à plantação de igrejas.",
      en: "A Brazilian missionary in Europe since 2004, Paulo Sicoli is the pastor of the Reformed Evangelical Church La Chapelle in Saint-Hippolyte-du-Fort. Sent by APMT and partnering with UNEPREF, he dedicates his ministry to teaching, pastoral care, and church planting.",
    },
    fullBio: {
      fr: "Paulo Sicoli est marié avec Valéria Chiarello Sicoli. Ils ont trois filles et quatre petits-enfants.\n\nMissionnaires brésiliens, ils servent en Europe depuis 2004, soit plus de vingt ans d'engagement dans le ministère missionnaire. Ils sont envoyés par l'APMT, agence missionnaire de l'Église Presbytérienne du Brésil.\n\nAprès plusieurs années d'activité comme entrepreneur, Paulo s'est orienté vers la théologie. Il est titulaire de deux masters, l'un en accompagnement familial et l'autre en théologie systématique.\n\nIl a servi dans la revitalisation d'églises en Islande et dans plusieurs pays d'Afrique de l'Ouest, où il a participé à la formation de responsables, à l'implantation d'églises et à des projets éducatifs.\n\nDepuis 2016, il vit en France, où il exerce son ministère dans le cadre d'un partenariat entre l'APMT et l'UNEPREF.\n\nIl est pasteur de l'Église Réformée Évangélique La Chapelle, membre de l'UNEPREF, à Saint-Hippolyte-du-Fort, où il s'investit dans l'enseignement biblique, l'accompagnement pastoral et le développement de la vie communautaire.\n\nSon ministère est marqué par le désir de voir des vies transformées par l'Évangile, ainsi que par un engagement actif dans l'implantation et la croissance d'églises.\n\nAnimé par une approche innovante, Paulo développe également l'usage des outils multimédias et des plateformes numériques pour annoncer l'Évangile, en particulier auprès de publics et de contextes difficiles d'accès.\n\nPassionné de théologie et d'enseignement, il consacre une part importante de son ministère à la formation et à la transmission de la foi.",
      pt: "Paulo Sicoli é casado com Valéria Chiarello Sicoli. Eles têm três filhas e quatro netos.\n\nMissionários brasileiros, servem na Europa desde 2004, com mais de vinte anos de engajamento no ministério missionário. São enviados pela APMT, agência missionária da Igreja Presbiteriana do Brasil.\n\nApós vários anos como empresário, Paulo se voltou para a teologia. É titular de dois mestrados, um em acompanhamento familiar e outro em teologia sistemática.\n\nServiu na revitalização de igrejas na Islândia e em vários países da África Ocidental, onde participou da formação de líderes, da plantação de igrejas e de projetos educativos.\n\nDesde 2016, vive na França, onde exerce seu ministério no âmbito de uma parceria entre a APMT e a UNEPREF.\n\nÉ pastor da Igreja Reformada Evangélica La Chapelle, membro da UNEPREF, em Saint-Hippolyte-du-Fort, onde se dedica ao ensino bíblico, ao acompanhamento pastoral e ao desenvolvimento da vida comunitária.\n\nSeu ministério é marcado pelo desejo de ver vidas transformadas pelo Evangelho, bem como por um engajamento ativo na plantação e no crescimento de igrejas.\n\nAnimado por uma abordagem inovadora, Paulo também desenvolve o uso de ferramentas multimídia e plataformas digitais para anunciar o Evangelho, especialmente a públicos e contextos de difícil acesso.\n\nApaixonado por teologia e ensino, dedica uma parte importante de seu ministério à formação e à transmissão da fé.",
      en: "Paulo Sicoli is married to Valéria Chiarello Sicoli. They have three daughters and four grandchildren.\n\nBrazilian missionaries, they have been serving in Europe since 2004, with more than twenty years of commitment to missionary ministry. They are sent by APMT, the missionary agency of the Presbyterian Church of Brazil.\n\nAfter several years as an entrepreneur, Paulo turned to theology. He holds two master's degrees, one in family counseling and another in systematic theology.\n\nHe has served in church revitalization in Iceland and several West African countries, where he was involved in leadership training, church planting, and educational projects.\n\nSince 2016, he has lived in France, where he carries out his ministry within a partnership between APMT and UNEPREF.\n\nHe is the pastor of the Reformed Evangelical Church La Chapelle, a member of UNEPREF, in Saint-Hippolyte-du-Fort, where he is dedicated to biblical teaching, pastoral care, and the development of community life.\n\nHis ministry is marked by the desire to see lives transformed by the Gospel, as well as an active commitment to church planting and growth.\n\nDriven by an innovative approach, Paulo also develops the use of multimedia tools and digital platforms to proclaim the Gospel, particularly to audiences and contexts that are difficult to reach.\n\nPassionate about theology and teaching, he devotes a significant part of his ministry to formation and the transmission of faith.",
    },
    ministryAreas: ["teaching", "pastoral-care", "church-planting", "digital"],
    order: 1,
    active: true,
  },
];

export function getLeadershipTeam(): LeadershipMember[] {
  return LEADERSHIP_TEAM.filter((m) => m.active).sort(
    (a, b) => a.order - b.order
  );
}

export function getLeaderBySlug(slug: string): LeadershipMember | null {
  return LEADERSHIP_TEAM.find((m) => m.slug === slug && m.active) ?? null;
}
