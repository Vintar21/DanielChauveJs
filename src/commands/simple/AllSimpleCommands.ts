import ICommand from "../ICommand";
import BackseatCommand from "./BackseatCommand";
import CommandsManualCommand from "./CommandsManualCommand";
import ConfigCommand from "./ConfigCommand";
import CreditCommand from "./CreditCommand";
import DiscordCommand from "./DiscordCommand";
import GitCommand from "./GitCommand";
import PronounsCommand from "./PronounsCommand";
import QuadHdCommand from "./QuadHdCommand";
import SocialMediasCommand from "./SocialMediasCommand";
import SwitchFriendCodeCommand from "./SwitchFriendCodeCommand";
import YoutubeCommand from "./YoutubeCommand";

export const switchFriendCodeCommand = new SwitchFriendCodeCommand();
export const discordCommand = new DiscordCommand();
export const socialMediasCommand = new SocialMediasCommand();
export const youtubeCommand = new YoutubeCommand();
export const backseatCommand = new BackseatCommand();
export const configCommand = new ConfigCommand();
export const creditCommand = new CreditCommand();
export const pronounsCommand = new PronounsCommand();
export const quadHdCommand = new QuadHdCommand();
export const gitCommand = new GitCommand();
export const manCommand = new CommandsManualCommand();

// Arrays
export const allSimpleCommands: Array<ICommand> = [
  discordCommand,
  youtubeCommand,
  socialMediasCommand,
  backseatCommand,
  configCommand,
  creditCommand,
  pronounsCommand,
  manCommand,
  quadHdCommand,
  gitCommand,
  switchFriendCodeCommand,
];
