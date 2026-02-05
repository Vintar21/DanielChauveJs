import ICommand from "../ICommand";
import DanielCommand from "./DanielCommand";
import HelloCommand from "./HelloCommand";
import ShittyGameCommand from "./ShittyGameCommand";
import SwitchFriendCodeCommand from "./SwitchFriendCodeCommand";
import DiscordCommand from "./DiscordCommand";
import SocialMediasCommand from "./SocialMediasCommand";
import YoutubeCommand from "./YoutubeCommand";
import { allJdrCommands } from "./jdr/AllJdrCommands";
import BackseatCommand from "./BackseatCommand";
import ChaiseCommand from "./ChaiseCommand";
import ConfigCommand from "./ConfigCommand";
import CreditCommand from "./CreditCommand";
import DocRollCommand from "./DocRollCommand";
import PbCommand from "./PbCommand";
import PronounsCommand from "./PronounsCommand";
import QuadHdCommand from "./QuadHdCommand";
import TutosCelesteCommand from "./TutosCelesteCommand";
import VocabCelesteCommand from "./VocabCelesteCommand";

export const danielCommand = new DanielCommand();
export const helloCommand = new HelloCommand();
export const shittyGameCommand = new ShittyGameCommand();
export const switchFriendCodeCommand = new SwitchFriendCodeCommand();
export const discordCommand = new DiscordCommand();
export const socialMediasCommand = new SocialMediasCommand();
export const youtubeCommand = new YoutubeCommand();
export const backseatCommand = new BackseatCommand();
export const chaiseCommand = new ChaiseCommand();
export const configCommand = new ConfigCommand();
export const creditCommand = new CreditCommand();
export const docRollCommand = new DocRollCommand();
export const pbCommand = new PbCommand();
export const pronounsCommand = new PronounsCommand();
export const quadHdCommand = new QuadHdCommand();
export const tutosCelesteCommand = new TutosCelesteCommand();
export const vocabCelesteCommand = new VocabCelesteCommand();

// Arrays
export const allSimpleCommands: Array<ICommand> = [
  discordCommand,
  youtubeCommand,
  socialMediasCommand,
  danielCommand,
  backseatCommand,
  chaiseCommand,
  docRollCommand,
  configCommand,
  creditCommand,
  pbCommand,
  pronounsCommand,
  quadHdCommand,
  tutosCelesteCommand,
  vocabCelesteCommand,
  shittyGameCommand,
  switchFriendCodeCommand,
  helloCommand,
  ...allJdrCommands,
];
