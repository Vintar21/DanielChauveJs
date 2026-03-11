export type Right = number;
export class Permissions<T> {
  static BYPASS: Right = 1;
  static ALLOWED: Right = 0;
  static UNALLOWED: Right = -1;

  private permissionsMap: Map<T, Right>;
  private defaultPermission: Right = Permissions.ALLOWED;

  // Only if T instance of string
  private caseSensitive = false;

  constructor(defaultPermissions?: [T, Right][]) {
    this.permissionsMap = defaultPermissions
      ? new Map(defaultPermissions)
      : new Map();
  }

  public setPermissionsMap(newMap: Map<T, Right>): void {
    this.permissionsMap = newMap;
  }

  // Prefer using getRightOrDefault instead
  public getRight(element: T): Right | undefined {
    element =
      (element instanceof String || typeof element === "string") &&
      !this.caseSensitive
        ? (element.toLowerCase() as T)
        : element;
    return this.permissionsMap.get(element);
  }

  public getDefaultPermission(): Right {
    return this.defaultPermission;
  }

  public getRightOrDefault(element: T): Right {
    const right = this.getRight(element);
    if (!right) {
      //warn(`No permission found for ${element} !`);
    }
    return right ?? this.defaultPermission;
  }

  public canBypass(element: T): boolean {
    return this.getRightOrDefault(element) === Permissions.BYPASS;
  }

  // If it can bypass, he's allowed too
  public isAllowed(element: T): boolean {
    const right = this.getRightOrDefault(element);
    return right === Permissions.ALLOWED || right === Permissions.BYPASS;
  }

  public isUnallowed(element: T): boolean {
    return this.getRightOrDefault(element) === Permissions.UNALLOWED;
  }

  public setPermission(element: T, permission: Right): void {
    element =
      (element instanceof String || typeof element === "string") &&
      !this.caseSensitive
        ? (element.toLowerCase() as T)
        : element;
    this.permissionsMap.set(element, permission);
  }

  public setPermissionForEach(elements: T[], permission: Right): void {
    elements.forEach((e) => this.setPermission(e, permission));
  }

  public setPermissionsForAllExcept(elements: T[], right: Right): void {
    // Insert given elements in the permissionsMap if not already present
    elements.forEach((e) =>
      this.setPermission(e, this.getRight(e) ?? this.defaultPermission),
    );
    // Change defaultPermission and all permissionsMap values which aren't in the given elements
    this.defaultPermission = right;
    this.permissionsMap.forEach((value: Right, key: T) => {
      if (!elements.includes(key)) {
        this.setPermission(key, right);
      }
    });
  }

  public setPermissionsForAll(right: Right): void {
    this.setPermissionsForAllExcept([], right);
  }

  public bypassDefault(): void {
    this.defaultPermission = Permissions.BYPASS;
  }

  public bypass(element: T): void {
    this.setPermission(element, Permissions.BYPASS);
  }

  public bypassEach(elements: T[]): void {
    this.setPermissionForEach(elements, Permissions.BYPASS);
  }

  public bypassAllExcept(elements: T[]): void {
    this.setPermissionsForAllExcept(elements, Permissions.BYPASS);
  }

  public bypassAll(): void {
    this.setPermissionsForAll(Permissions.BYPASS);
  }

  public allowDefault(): void {
    this.defaultPermission = Permissions.ALLOWED;
  }

  public allow(element: T): void {
    this.setPermission(element, Permissions.ALLOWED);
  }

  public allowEach(elements: T[]): void {
    this.setPermissionForEach(elements, Permissions.ALLOWED);
  }

  public allowAllExcept(elements: T[]): void {
    this.setPermissionsForAllExcept(elements, Permissions.ALLOWED);
  }

  public allowAll(): void {
    this.setPermissionsForAll(Permissions.ALLOWED);
  }

  public unallowDefault(): void {
    this.defaultPermission = Permissions.UNALLOWED;
  }

  public unallow(element: T): void {
    this.setPermission(element, Permissions.UNALLOWED);
  }

  public unallowEach(elements: T[]): void {
    this.setPermissionForEach(elements, Permissions.UNALLOWED);
  }

  public unallowAllExcept(elements: T[]): void {
    this.setPermissionsForAllExcept(elements, Permissions.UNALLOWED);
  }

  public unallowAll(): void {
    this.setPermissionsForAll(Permissions.UNALLOWED);
  }

  // By default
  public ignoreCase(): void {
    this.caseSensitive = false;
  }

  public dontIgnoreCase(): void {
    this.caseSensitive = true;
  }
}
