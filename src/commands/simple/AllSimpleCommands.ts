import ICommand from "../ICommand";
import BackseatCommand from "./BackseatCommand";
import ChaiseCommand from "./ChaiseCommand";
import ConfigCommand from "./ConfigCommand";
import CreditCommand from "./CreditCommand";
import DanielCommand from "./DanielCommand";
import DiscordCommand from "./DiscordCommand";
import DocRollCommand from "./DocRollCommand";
import GitCommand from "./GitCommand";
import HelloCommand from "./HelloCommand";
import PbCommand from "./PbCommand";
import PronounsCommand from "./PronounsCommand";
import QuadHdCommand from "./QuadHdCommand";
import ShittyGameCommand from "./ShittyGameCommand";
import SocialMediasCommand from "./SocialMediasCommand";
import SwitchFriendCodeCommand from "./SwitchFriendCodeCommand";
import TutosCelesteCommand from "./TutosCelesteCommand";
import VocabCelesteCommand from "./VocabCelesteCommand";
import YoutubeCommand from "./YoutubeCommand";
import { allJdrCommands } from "./jdr/AllJdrCommands";

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
export const gitCommand = new GitCommand();

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
  gitCommand,
  tutosCelesteCommand,
  vocabCelesteCommand,
  shittyGameCommand,
  switchFriendCodeCommand,
  helloCommand,
  ...allJdrCommands,
];
