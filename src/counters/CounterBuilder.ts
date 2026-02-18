import { EMPTY } from "../utils/StringConstants";
import Counter from "./Counter";
import { CounterBehaviors, CounterBehavior } from "./CounterUtils";

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

  private isStoredInDatabase: boolean = true;

  private static INSTANCE: CounterBuilder = new CounterBuilder();

  private constructor() {}

  public static getInstance(): CounterBuilder {
    return CounterBuilder.INSTANCE;
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

  public stop(stopValue: number): CounterBuilder {
    this._stopValue = stopValue;
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

  public customBehavior(customBehavior: (c: number) => number): CounterBuilder {
    this._behavior = customBehavior;
    return this;
  }

  public obsSourceName(sourceName: string): CounterBuilder {
    this._useObsSource = sourceName !== undefined && sourceName !== EMPTY;
    this._obsSourceName = sourceName;
    return this;
  }

  public obsTextSourceTemplate(template: string): CounterBuilder {
    this._obsTextSourceTemplate = template;
    return this;
  }

  public storedInDatabase(): CounterBuilder {
    this.isStoredInDatabase = true;
    return this;
  }

  public notStoredInDatabase(): CounterBuilder {
    this.isStoredInDatabase = false;
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
      this.isStoredInDatabase,
      this._stopValue,
      this._categoryRelated,
      this._categoryName,
      this._useObsSource,
      this._obsSourceName,
      this._obsTextSourceTemplate,
    );
  }
}
