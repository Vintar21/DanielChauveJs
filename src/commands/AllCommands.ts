import { bluePrinceDayCounter, deathCounter } from "../counters/AllCounters";
import BluePrinceDayCounterCommand from "./counters/BluePrinceDayCounterCommand";
import DeathCounterCommand from "./counters/DeathCounterCommand";
import AnswerRandomMessage from "./misc/AnswerRandomMessage";
import ChooseFromGSheetCommand from "./misc/ChooseFromGSheetCommand";
import MarkerCommand from "./misc/MarkerCommand";
import MultiCommand from "./misc/MultiCommand";
import PollCommand from "./misc/PollCommand";
import PredictionCommand from "./misc/PredictionCommand";
import SetCategoryCommand from "./misc/SetCategoryCommand";
import SetTitleCommand from "./misc/SetTitleCommand";
import ItsATenButCommand from "./multiple-answers/ItsATenButCommand";
import SmashOrPassCommand from "./multiple-answers/SmashOrPassCommand";
import BackseatCommand from "./simple/BackseatCommand";
import CommandsManualCommand from "./simple/CommandsManualCommand";
import ConfigCommand from "./simple/ConfigCommand";
import CreditCommand from "./simple/CreditCommand";
import DiscordCommand from "./simple/DiscordCommand";
import GitCommand from "./simple/GitCommand";
import LurkCommand from "./simple/LurkCommand";
import PronounsCommand from "./simple/PronounsCommand";
import QuadHdCommand from "./simple/QuadHdCommand";
import SocialMediasCommand from "./simple/SocialMediasCommand";
import SwitchFriendCodeCommand from "./simple/SwitchFriendCodeCommand";
import YoutubeCommand from "./simple/YoutubeCommand";
import ACounterCommand from "./templates/ACounterCommand";
import ICommand from "./templates/ICommand";
import FakeBanCommand from "./trolls/FakeBanCommand";

// ----- Simple commands -----
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
export const lurkCommand = new LurkCommand();

export const allSimpleCommands: Array<ICommand> = [
  discordCommand,
  youtubeCommand,
  socialMediasCommand,
  backseatCommand,
  configCommand,
  creditCommand,
  pronounsCommand,
  manCommand,
  lurkCommand,
  quadHdCommand,
  gitCommand,
  switchFriendCodeCommand,
];

// No prefix commands
export const allNoPrefixSimpleCommands: Array<ICommand> = [];

// ----- Multiple Answers Commands -----

export const smashOrPassCommand: SmashOrPassCommand = new SmashOrPassCommand();
export const itsATenButCommand: ItsATenButCommand = new ItsATenButCommand();

export const allMultipleAnswersCommands: Array<ICommand> = [
  smashOrPassCommand,
  itsATenButCommand,
];

// ----- Misc Commands -----
export const multiCommand: MultiCommand = new MultiCommand();
export const markerCommand: MarkerCommand = new MarkerCommand();
export const predictionCommand: PredictionCommand = new PredictionCommand();
export const pollCommand: PollCommand = new PollCommand();
export const fakeBanCommand: FakeBanCommand = new FakeBanCommand();
export const chooseFromGsheetCommand: ChooseFromGSheetCommand =
  new ChooseFromGSheetCommand();
export const setCategoryCommand: SetCategoryCommand = new SetCategoryCommand();
export const setTitleCommand: SetTitleCommand = new SetTitleCommand();

// In a separate array because it should be added in last !
export const answerRandomMessage: AnswerRandomMessage =
  new AnswerRandomMessage();

export const allMiscCommands: Array<ICommand> = [
  markerCommand,
  multiCommand,
  pollCommand,
  predictionCommand,
  setCategoryCommand,
  setTitleCommand,
  fakeBanCommand,
  chooseFromGsheetCommand,
];
export const lastAddedCommands: Array<ICommand> = [answerRandomMessage];

// ------ Counters Commands -----
export const deathCounterCommand: DeathCounterCommand = new DeathCounterCommand(
  deathCounter,
  true,
);

export const bluePrinceDayCommand: BluePrinceDayCounterCommand =
  new BluePrinceDayCounterCommand(bluePrinceDayCounter);

export const allCounterCommands: ACounterCommand[] = [
  deathCounterCommand,
  bluePrinceDayCommand,
];
