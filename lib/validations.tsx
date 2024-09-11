import { z } from "zod";

export const QuestionsSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must have atleast 5 characters" })
    .max(130),
  explaination: z
    .string()
    .min(25, { message: "Explanation must have atleast 25 characters" }),
  tags: z
    .array(z.string().min(1).max(15))
    .min(1, { message: "Plase add one tag atleast" })
    .max(3, { message: "Only three tags are allowed" }),
});

export const AnswerSchema = z.object({
  answer: z
    .string()
    .min(5, { message: "Answer must have atleast 5 characters" }),
});

export const ReplySchema = z.object({
  reply: z.string().min(5, { message: "Reply must have atleast 5 characters" }),
  anonymity: z.string(),
});

export enum NoteType {
  confession = "confession",
  opinion = "opinion",
}

export const ProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must have atleast 3 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must have atleast 3 characters" }),
  bio: z
    .string()
    .min(5, { message: "Bio must have atleast 5 characters" })
    .max(150, { message: "Bio can have atmost 150 characters" }),
  college: z
    .string()
    .min(2, { message: "College name must have atleast 2 characters" }),
  instagram: z
    .string()
    .min(5, { message: "Instagram Link must is not valid." }),
});

export const NoteSchema = z.object({
  title: z.string().min(5, { message: "Title must have atleast 5 characters" }),
  content: z
    .string()
    .min(5, { message: "Content must have atleast 5 characters" }),
  noteType: z.nativeEnum(NoteType),
  noteFor: z.string(),
  anonymity: z.string(),
});
export enum ShoutoutTitles {
  default = "NA",
  AdventureBuddy = "Adventure Buddy",
  AngelEyes = "Angel Eyes",
  Badmosss = "Badmosss",
  BestBehan = "Best Behan",
  BestBhai = "Best Bhai",
  Bahanebaaz = "Bahanebaaz",
  Bandar = "Bandar",
  Bandariyaa = "Bandariyaa",
  Bhabhiji = "Bhabhiji",
  ClassClown = "Class Clown",
  Crush = "Crush",
  Chatterbox = "Chatterbox",
  Creative = "Creative",
  Cutie = "Cutie",
  Confidant = "Confidant",
  Dramebaaz = "Dramebaaz",
  DilChor = "Dil Chor",
  EkdumBindass = "Ekdum Bindass",
  FunniestClassmate = "Funniest Classmate",
  GroupKiShaan = "Group Ki Shaan",
  GyaaniBaba = "Gyaani Baba",
  Jugadu = "Jugadu",
  Kanjoos = "Kanjoos",
  KingOfMyHeart = "King of My Heart",
  Khadoos = "Khadoos",
  LastMinuteTutor = "Last Minute Tutor",
  MultiTalented = "Multi Talented",
  MastiKhor = "Masti Khor",
  MissPerfect = "Miss Perfect",
  MostCharmingGuy = "Most Charming Guy",
  MostHelpfulClassmate = "Most Helpful Classmate",
  MyStrongestPillar = "My Strongest Pillar",
  NakhreAtPeak = "Nakhre at Peak",
  PasandidaAurat = "Pasandida Aurat",
  PasandidaMard = "Pasandida Mard",
  Pakau = "Pakau",
  ParamSundarKanya = "Param Sundar Kanya",
  ProblemSolver = "Problem Solver",
  Sanskaari = "Sanskaari",
  SabseSundarMuskan = "Sabse Sundar Muskan",
  SilentKiller = "Silent Killer",
  SleepyHead = "Sleepy Head",
  SmartAF = "Smart AF",
  SocialButterfly = "Social Butterfly",
  Soulmate = "Soulmate",
  Shy = "Shy",
  ShyBandar = "Shy Bandar",
  Sweetheart = "Sweetheart",
  Romeo = "Romeo",
  Rude = "Rude",
  TheGossipQueen = "The Gossip Queen",
  Topper = "Topper",
  Troublemaker = "Troublemaker",
  UffVoAankhein = "Uff Vo Aankhein",
}

export const ShoutoutSchema = z.object({
  title: z.nativeEnum(ShoutoutTitles),
  receiverName: z.string().min(3, { message: "Username must be valid" }),
  anonymity: z.string(),
});
