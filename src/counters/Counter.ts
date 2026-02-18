import { MainApp } from "../app";
import SqlManager from "../database/SqlManager";
import {
  CounterBehavior,
  CounterBehaviors,
  COUNTER_VALUE,
} from "./CounterUtils";

export default class Counter {
  private name: string;
  private value: number;

  private startValue: number;
  private step: number;
  private stopValue: number | undefined;

  // TODO: several categories
  private categoryRelated: boolean;
  private categoryName: string | undefined;

  private behavior: CounterBehavior;

  private useObsSource: boolean;
  private obsSourceName: string | undefined;
  private obsTextSourceTemplate: string;

  private isStoredInDatabase: boolean;

  private freezed: boolean = false;

  constructor(
    name: string,
    start: number,
    step: number,
    behavior: CounterBehavior,
    storedInDatabase: boolean,
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
    this.isStoredInDatabase = storedInDatabase;
    this.stopValue = stop;
    this.categoryRelated = categoryRelated;
    this.categoryName = categoryName;
    this.useObsSource = useObsSource;
    this.obsSourceName = obsSourceName;
    this.obsTextSourceTemplate =
      obsTextSourceTemplate ?? `${this.name}: ${COUNTER_VALUE}`;
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

  public freeze() {
    this.freezed = true;
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

  public usingObsSource(): boolean {
    return this.useObsSource;
  }

  public getObsSourceName(): string | undefined {
    return this.obsSourceName;
  }

  public isCategoryRelated(): boolean {
    return this.categoryRelated;
  }

  public getCategory(): string | undefined {
    return this.categoryName;
  }

  public saveCounter() {
    // Save in file

    // Save in Database
    if (this.isStoredInDatabase) {
      SqlManager.updateCounter(this.name, this.value, this.categoryName);
    }

    // Update OBS
    if (this.useObsSource && this.obsSourceName) {
      MainApp.getObsManager().updateObsTextSource(
        this.obsSourceName,
        this.obsTextSourceTemplate.replace(
          COUNTER_VALUE,
          this.value.toString(),
        ),
      );
    }
  }

  public toString(): string {
    return JSON.stringify(this);
  }

  // Initialize counters after database
  public async init(): Promise<void> {
    // Look into files or database to get the counter value

    // Database
    if (this.isStoredInDatabase) {
      await SqlManager.getCounterValue(this.name, this.categoryName).then(
        (value) => (this.value = value ?? this.startValue),
      );
    }
  }
}
