import { MainApp } from "../app";
import SqlManager from "../database/SqlManager";
import {
  CounterBehavior,
  CounterBehaviors,
  CounterStorage,
  CounterStorages,
} from "./CounterUtils";

import { formatCounterMessage, Placeholders } from "../utils/CommandsUtils";

export default class Counter {
  protected name: string;
  protected value: number;

  protected startValue: number;
  protected step: number;
  private stopValue: number | undefined;

  // TODO: several categories
  protected categoryRelated: boolean;
  protected categoryName: string | undefined;

  protected behavior: CounterBehavior;

  protected useObsSource: boolean;
  protected obsSourceName: string | undefined;
  protected obsTextSourceTemplate: string;

  protected isStoredInDatabase: boolean;
  protected isStoredInGSheet: boolean;

  protected freezed: boolean = false;

  constructor(
    name: string,
    start: number,
    step: number,
    behavior: CounterBehavior,
    storage: CounterStorage,
    stop: number | undefined,
    categoryRelated: boolean,
    categoryName: string | undefined,
    useObsSource: boolean,
    obsSourceName: string | undefined,
    obsTextSourceTemplate: string | undefined,
  ) {
    this.name = name;
    this.startValue = start;
    this.value = this.startValue;
    this.step = step;
    this.behavior = behavior;
    this.isStoredInDatabase = storage === CounterStorages.DATABASE;
    this.isStoredInGSheet = storage === CounterStorages.GSHEET;
    this.stopValue = stop;
    this.categoryRelated = categoryRelated;
    this.categoryName = categoryName;
    this.useObsSource = useObsSource;
    this.obsSourceName = obsSourceName;
    this.obsTextSourceTemplate =
      obsTextSourceTemplate ?? `${this.name}: ${Placeholders.COUNTER}`;
  }

  public freeze() {
    this.freezed = true;
  }

  public unfreeze() {
    this.freezed = false;
  }

  public isFreezed() {
    return this.freezed;
  }

  // Return the new value of the counter
  public setValue(newValue: number): number {
    if (!this.freezed) {
      this.value = newValue;
      this.freezed =
        this.stopValue !== undefined && this.value === this.stopValue;
    }
    this.saveCounter();
    return this.value;
  }

  // Return the new value of the counter
  public resetValue(): number {
    this.freezed = false;
    return this.setValue(this.startValue);
  }

  // Return the new value of the counter
  public add(increment: number): number {
    if (!this.freezed) {
      this.value += increment;
      this.freezed =
        this.stopValue !== undefined && this.value >= this.stopValue;
    }
    this.saveCounter();
    return this.value;
  }

  // Return the new value of the counter
  public addStep(): number {
    return this.add(this.step);
  }

  // Return the new value of the counter
  public substract(increment: number): number {
    if (!this.freezed) {
      this.value -= increment;
      this.freezed =
        this.stopValue !== undefined && this.value <= this.stopValue;
    }
    this.saveCounter();
    return this.value;
  }

  // Return the new value of the counter
  public substractStep(): number {
    return this.substract(this.step);
  }

  // Return the new value of the counter
  public triggerCounter(): number {
    if (this.behavior === CounterBehaviors.INCREMENT) {
      this.addStep();
    } else if (this.behavior === CounterBehaviors.INCREMENT) {
      this.substractStep();
    } else if (!this.freezed && this.behavior instanceof Function) {
      this.value = this.behavior(this.value);
      this.freezed =
        this.stopValue !== undefined && this.value === this.stopValue;
      this.saveCounter();
    }
    return this.value;
  }

  public getId(): string {
    return this.categoryRelated
      ? `${this.name}:${this.categoryName}`
      : `${this.name}`;
  }

  public getName(): string {
    return this.name;
  }

  public getValue(): number {
    return this.value;
  }

  public getStartValue(): number {
    return this.startValue;
  }

  public getStopValue(): number {
    return this.stopValue;
  }

  public getStep(): number {
    return this.step;
  }

  public isCategoryRelated(): boolean {
    return this.categoryRelated;
  }

  public getCategory(): string | undefined {
    return this.categoryName;
  }

  public getBehavior(): CounterBehavior {
    return this.behavior;
  }

  public usingObsSource(): boolean {
    return this.useObsSource;
  }

  public getObsSourceName(): string | undefined {
    return this.obsSourceName;
  }

  public getObsTextSourceTemplate(): string {
    return this.obsTextSourceTemplate;
  }

  public getStoredInDatabase(): boolean {
    return this.isStoredInDatabase;
  }

  public getStoredInGSheet(): boolean {
    return this.isStoredInGSheet;
  }

  // By default create and save a local file if no gsheet nor database
  public saveCounter() {
    // Save in Database
    if (this.isStoredInDatabase) {
      SqlManager.updateCounter(this.name, this.value, this.categoryName);
    } else if (this.isStoredInGSheet) {
      MainApp.getGoogleSheetManager().updateCounter(
        this.name,
        this.value,
        this.categoryName,
      );
    }

    const obsManager = MainApp.getObsManager();
    // Update OBS
    if (obsManager && this.useObsSource && this.obsSourceName) {
      obsManager.updateObsTextSource(
        this.obsSourceName,
        formatCounterMessage(this.obsTextSourceTemplate, this).toString(),
      );
    }
  }

  public toString(): string {
    return JSON.stringify(this);
  }

  // Initialize counters after database
  public async init(): Promise<void> {
    // Look into files or database to get the counter value

    var initialCounterValue: Promise<number> = Promise.resolve(undefined);

    // Database
    if (this.isStoredInDatabase) {
      initialCounterValue = SqlManager.getCounterValue(
        this.name,
        this.categoryName,
      );
    } else if (this.isStoredInGSheet) {
      initialCounterValue = MainApp.getGoogleSheetManager().getCounterValue(
        this.name,
        this.categoryName,
      );
    }

    await initialCounterValue.then(
      (value) => (this.value = value ?? this.startValue),
    );
  }
}
