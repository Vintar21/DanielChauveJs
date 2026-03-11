import { MainApp } from "../../../app";
import { EMPTY, SPACE } from "../../StringConstants";
import { CategoryTags } from "../tags/CategoryTags";

type CategoryId = string | undefined;

export default class ATwitchCategory {
  protected name: string;
  protected simpleName: string;
  protected id: CategoryId;
  protected aliases: Array<RegExp | string>;

  protected tags: CategoryTags;

  constructor(
    name: string,
    aliases: Array<RegExp | string> = new Array(),
    tags: CategoryTags = new CategoryTags(),
  ) {
    this.name = name;
    this.simpleName = this.simplifyName(this.name);
    this.aliases = aliases;
    this.tags = tags;
  }

  public match(categoryName: string): boolean {
    const givenName = this.simplifyName(categoryName);
    if (givenName === this.simpleName) {
      return true;
    }

    const matchedAlias = this.aliases.find((alias) => {
      if (typeof alias === "string" || alias instanceof String) {
        return categoryName === alias;
      }

      if (alias instanceof RegExp) {
        return givenName.match(alias);
      }
    });

    return matchedAlias !== undefined;
  }

  public getName(): string {
    return this.name;
  }

  public getSimpleName(): string {
    return this.simpleName;
  }

  public getTags(): CategoryTags {
    return this.tags;
  }

  public addAliases(aliases: Array<RegExp | string>): void {
    aliases.forEach((alias) => this.aliases.push(alias));
  }

  public simplifyName(name: string): string {
    return name
      .toLowerCase()
      .normalize()
      .replaceAll(/[^a-z0-9\s]/gi, SPACE)
      .trim();
  }

  public async getId(): Promise<string> {
    if (this.id) {
      return this.id;
    }

    const gameId = (
      await MainApp.getTwitchClient().getGamesApi().getGameByName(this.name)
    )?.id;
    if (gameId && gameId !== null) {
      this.id = gameId;
      return this.id;
    }

    // Category is invalid or Twitch api's return an error
    return EMPTY;
  }

  public toString(): string {
    return this.name;
  }
}
