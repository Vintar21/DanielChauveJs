export type Right = number;
export const BYPASS: Right = 1;
export const ALLOWED: Right = 0;
export const UNALLOWED: Right = -1;
// TODO: delete it
export const DEFAULT_RIGHT: Right = ALLOWED;

export class Permissions<T> {
  private permissionsMap: Map<T, Right>;
  private defaultPermission: Right = ALLOWED;

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
    return this.permissionsMap.get(element);
  }

  public getDefaultPermission(): Right {
    return this.defaultPermission;
  }

  public getRightOrDefault(element: T): Right {
    const right = this.permissionsMap.get(element);
    if (!right) {
      console.warn(`No permission found for ${element} !`);
    }
    return right ?? this.defaultPermission;
  }

  public canBypass(element: T): boolean {
    return this.getRightOrDefault(element) === BYPASS;
  }

  // If it can bypass, he's allowed too
  public isAllowed(element: T): boolean {
    const right = this.getRightOrDefault(element);
    return right === ALLOWED || right === BYPASS;
  }

  public isUnallowed(element: T): boolean {
    return this.getRightOrDefault(element) === UNALLOWED;
  }

  public setPermission(element: T, permission: Right): void {
    this.permissionsMap.set(element, permission);
  }

  public setPermissionForEach(elements: T[], permission: Right): void {
    elements.forEach((e) => this.permissionsMap.set(e, permission));
  }

  public setPermissionsForAllExcept(elements: T[], right: Right): void {
    // Insert given elements in the permissionsMap if not already present
    elements.forEach((e) =>
      this.permissionsMap.set(
        e,
        this.permissionsMap.get(e) ?? this.defaultPermission,
      ),
    );
    // Change defaultPermission and all permissionsMap values which aren't in the given elements
    this.defaultPermission = right;
    this.permissionsMap.forEach((value: Right, key: T) => {
      if (!elements.includes(key)) {
        this.permissionsMap.set(key, right);
      }
    });
  }

  public setPermissionsForAll(right: Right): void {
    this.setPermissionsForAllExcept([], right);
  }

  public bypassDefault(): void {
    this.defaultPermission = BYPASS;
  }

  public bypass(element: T): void {
    this.setPermission(element, BYPASS);
  }

  public bypassEach(elements: T[]): void {
    this.setPermissionForEach(elements, BYPASS);
  }

  public bypassAllExcept(elements: T[]): void {
    this.setPermissionsForAllExcept(elements, BYPASS);
  }

  public bypassAll(): void {
    this.setPermissionsForAll(BYPASS);
  }

  public allowDefault(): void {
    this.defaultPermission = ALLOWED;
  }

  public allow(element: T): void {
    this.setPermission(element, ALLOWED);
  }

  public allowEach(elements: T[]): void {
    this.setPermissionForEach(elements, ALLOWED);
  }

  public allowAllExcept(elements: T[]): void {
    this.setPermissionsForAllExcept(elements, ALLOWED);
  }

  public allowAll(): void {
    this.setPermissionsForAll(ALLOWED);
  }

  public unallowDefault(): void {
    this.defaultPermission = UNALLOWED;
  }

  public unallow(element: T): void {
    this.setPermission(element, UNALLOWED);
  }

  public unallowEach(elements: T[]): void {
    this.setPermissionForEach(elements, UNALLOWED);
  }

  public unallowAllExcept(elements: T[]): void {
    this.setPermissionsForAllExcept(elements, UNALLOWED);
  }

  public unallowAll(): void {
    this.setPermissionsForAll(UNALLOWED);
  }
}
