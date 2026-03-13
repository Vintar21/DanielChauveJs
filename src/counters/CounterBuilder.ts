import { EMPTY } from "../utils/StringConstants";
import Counter from "./Counter";
import {
  CounterBehaviors,
  CounterBehavior,
  CounterStorage,
  CounterStorages,
} from "./CounterUtils";

export default class CounterBuilder {
  private _name: string = EMPTY;

  private _startValue: number = 0;
  private _step: number = 1;
  private _stopValue: number | undefined = undefined;

  private _categoryRelated: boolean = false;
  private _categoryName: string | undefined = undefined;

  private _behavior: CounterBehavior = CounterBehaviors.INCREMENT;

  private _useObsSource: boolean = false;
  private _obsSourceName: string | undefined = undefined;
  private _obsTextSourceTemplate: string | undefined = undefined;

  // Change this default value if you don't have a database
  private storage: CounterStorage = CounterStorages.DATABASE;

  private constructor() {}

  public static getInstance(): CounterBuilder {
    return new CounterBuilder();
  }

  public name(name: string): CounterBuilder {
    this._name = name;
    return this;
  }

  public start(startValue: number): CounterBuilder {
    this._startValue = startValue;
    return this;
  }

  public step(step: number): CounterBuilder {
    this._step = step;
    return this;
  }

  public stop(stopValue: number | undefined): CounterBuilder {
    this._stopValue = stopValue;
    return this;
  }

  public categoryRelated(): CounterBuilder {
    this._categoryRelated = true;
    return this;
  }

  public notCategoryRelated(): CounterBuilder {
    this._categoryRelated = false;
    return this;
  }

  public category(categoryName: string): CounterBuilder {
    this._categoryRelated =
      categoryName !== undefined && categoryName !== EMPTY;
    this._categoryName = categoryName;
    return this;
  }

  public increment(): CounterBuilder {
    this._behavior = CounterBehaviors.INCREMENT;
    return this;
  }

  public decrement(): CounterBuilder {
    this._behavior = CounterBehaviors.DECREMENT;
    return this;
  }

  public behavior(behavior: CounterBehavior): CounterBuilder {
    this._behavior = behavior;
    return this;
  }

  public customBehavior(customBehavior: (c: number) => number): CounterBuilder {
    this._behavior = customBehavior;
    return this;
  }

  public obsSourceName(sourceName: string | undefined): CounterBuilder {
    this._useObsSource = sourceName !== undefined && sourceName !== EMPTY;
    this._obsSourceName = sourceName;
    return this;
  }

  public obsTextSourceTemplate(template: string | undefined): CounterBuilder {
    this._obsTextSourceTemplate = template;
    return this;
  }

  public setStorage(storage: CounterStorage): CounterBuilder {
    this.storage = storage;
    return this;
  }

  public from(counter: Counter): CounterBuilder {
    this._name = counter.getName();
    this._startValue = counter.getStartValue();
    this._step = counter.getStep();
    this._behavior = counter.getBehavior();
    this.storage = counter.getStoredInDatabase()
      ? CounterStorages.DATABASE
      : counter.getStoredInGSheet()
        ? CounterStorages.GSHEET
        : undefined;
    this._stopValue = counter.getStopValue();
    this._categoryRelated = counter.isCategoryRelated();
    this._categoryName = counter.getCategory();
    this._useObsSource = counter.usingObsSource();
    this._obsSourceName = counter.getObsSourceName();
    this._obsTextSourceTemplate = counter.getObsTextSourceTemplate();

    return this;
  }

  public build(): Counter {
    if (this._name === EMPTY) {
      throw new Error("Cannot build a counter without a name !");
    }
    return new Counter(
      this._name,
      this._startValue,
      this._step,
      this._behavior,
      this.storage,
      this._stopValue,
      this._categoryRelated,
      this._categoryName,
      this._useObsSource,
      this._obsSourceName,
      this._obsTextSourceTemplate,
    );
  }
}
