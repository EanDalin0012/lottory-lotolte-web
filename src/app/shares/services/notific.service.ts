import { Injectable } from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';

@Injectable({
  providedIn: 'root'
})
export class NotificService {

  private horizontal = "right";
  private vertical = "top";

  constructor(
    private notificationService: NotificationService
  ) { }

  public showTopRight(content: string, style?: 'none' | 'success' | 'warning' | 'error' | 'info', closable?: boolean): void {
    this.notificationService.show({
      content: content,
      animation: { type: "slide", duration: 8000 },
      type: { style: style, icon: true },
      position: { horizontal: "right", vertical: "top" },
      closable,
    });
  }

  public showTopCenter(content: string, style?: 'none' | 'success' | 'warning' | 'error' | 'info', closable?: boolean): void {
    this.notificationService.show({
      content: content,
      animation: { type: "slide", duration: 8000 },
      type: { style: style, icon: true },
      position: { horizontal: "center", vertical: "top" },
      closable
    });
  }

  public showTopLeft(content: string, style?: 'none' | 'success' | 'warning' | 'error' | 'info', closable?: boolean): void {
    this.notificationService.show({
      content: content,
      animation: { type: "slide", duration: 8000 },
      type: { style: style, icon: true },
      position: { horizontal: "left", vertical: "top" },
      closable
    });
  }

  public showBottomRight(content: string, style?: 'none' | 'success' | 'warning' | 'error' | 'info', closable?: boolean): void {
    this.notificationService.show({
      content: content,
      animation: { type: "fade", duration: 800 },
      type: { style: style, icon: true },
      position: { horizontal: 'right', vertical: 'bottom' },
      closable
    });
  }

  public showBottomCenter(content: string, style?: 'none' | 'success' | 'warning' | 'error' | 'info', closable?: boolean): void {
    this.notificationService.show({
      content: content,
      animation: { type: "fade", duration: 800 },
      type: { style: style, icon: true },
      position: { horizontal: 'center', vertical: 'bottom' },
      closable
    });
  }

  public showBottomLeft(content: string, style?: 'none' | 'success' | 'warning' | 'error' | 'info', closable?: boolean): void {
    this.notificationService.show({
      content: content,
      animation: { type: "fade", duration: 800 },
      type: { style: style, icon: true },
      position: { horizontal: 'left', vertical: 'bottom' },
      closable
    });
  }

}
