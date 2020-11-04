import { TestBed, waitForAsync } from '@angular/core/testing';

import { of } from 'rxjs';

import { PoChartBaseComponent } from './po-chart-base.component';
import { PoChartComponent } from './po-chart.component';
import { PoChartModule } from './po-chart.module';
import { PoChartPieComponent } from './po-chart-types/po-chart-pie/po-chart-pie.component';
import { PoChartType } from './enums/po-chart-type.enum';

describe('PoChartComponent:', () => {
  let component: PoChartComponent;
  let fixture;
  let nativeElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [PoChartModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be create', () => {
    expect(component instanceof PoChartComponent).toBeTruthy();
    expect(component instanceof PoChartBaseComponent).toBeTruthy();
  });

  describe('Properties', () => {
    it('isChartGaugeType: should return `true` if type is equal `PoChartType.Gauge`', () => {
      component.type = PoChartType.Gauge;

      expect(component.isChartGaugeType).toBeTruthy();
    });

    it('isChartGaugeType: should return `false` if type is diferent from `PoChartType.Gauge`', () => {
      component.type = PoChartType.Pie;

      expect(component.isChartGaugeType).toBeFalsy();
    });

    it('isChartLineType: should return `true` if type is equal `PoChartType.Line`', () => {
      component.type = PoChartType.Line;

      expect(component.isChartLineType).toBeTruthy();
    });

    it('isChartLineType: should return `false` if type is diferent from `PoChartType.Line`', () => {
      component.type = PoChartType.Pie;

      expect(component.isChartLineType).toBeFalsy();
    });
  });

  describe('Methods:', () => {
    it('ngOnDestroy: should call `removeWindowResizeListener`', () => {
      spyOn(component, <any>'removeWindowResizeListener');

      component.ngOnDestroy();

      expect(component['removeWindowResizeListener']).toHaveBeenCalled();
    });

    it('ngOnInit: should call `getSvgContainerSize`', () => {
      spyOn(component, <any>'getSvgContainerSize');

      component.ngOnInit();

      expect(component['getSvgContainerSize']).toHaveBeenCalled();
    });

    describe('NgDoCheck: ', () => {
      it('should call `dynamicComponentSetting` on first loading and if chartWrapper has width', () => {
        Object.defineProperty(component.chartWrapper.nativeElement, 'offsetWidth', {
          writable: true,
          value: 500
        });

        spyOn(component, <any>'dynamicComponentSetting');

        component.ngDoCheck();

        expect(component['calculatedElement']).toBeTruthy();
        expect(component['dynamicComponentSetting']).toHaveBeenCalled();
      });

      it('shouldn`t call `dynamicComponentSetting` if `calculatedElement` is true', () => {
        Object.defineProperty(component.chartWrapper.nativeElement, 'offsetWidth', {
          writable: true,
          value: 500
        });

        component['calculatedElement'] = true;

        spyOn(component, <any>'dynamicComponentSetting');

        component.ngDoCheck();

        expect(component['dynamicComponentSetting']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `dynamicComponentSetting` if chartWrapper width is 0', () => {
        component['calculatedElement'] = false;
        Object.defineProperty(component.chartWrapper.nativeElement, 'offsetWidth', {
          writable: true,
          value: 0
        });

        spyOn(component, <any>'dynamicComponentSetting');

        component.ngDoCheck();

        expect(component['dynamicComponentSetting']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `dynamicComponentSetting` if `getComponentType` returns false', () => {
        component.type = PoChartType.Line;

        spyOn(component, <any>'dynamicComponentSetting');

        component.ngDoCheck();

        expect(component['calculatedElement']).toBeFalsy();
        expect(component['dynamicComponentSetting']).not.toHaveBeenCalled();
      });
    });

    it(`createComponent: should call 'getComponentType', 'resolveComponentFactory', 'chartContainer.createComponent'
      and 'setComponentRefProperties' `, () => {
      const componentRef: any = { instance: {} };

      spyOn(component, <any>'getComponentType').and.returnValue(PoChartType.Pie);
      spyOn(component['componentFactoryResolver'], 'resolveComponentFactory');
      spyOn(component.chartContainer, 'createComponent').and.returnValue(componentRef);
      spyOn(component, <any>'setComponentRefProperties');

      component['createComponent']();

      expect(component['getComponentType']).toHaveBeenCalled();
      expect(component['componentFactoryResolver'].resolveComponentFactory).toHaveBeenCalled();
      expect(component.chartContainer.createComponent).toHaveBeenCalled();
      expect(component['setComponentRefProperties']).toHaveBeenCalled();
    });

    it('rebuildComponentRef: should call `dynamicComponentSetting` and `componentRef.destroy`', () => {
      const sourceObject = { componentRef: { destroy: () => {} } };
      Object.assign(component, sourceObject);

      spyOn(sourceObject.componentRef, 'destroy');
      spyOn(component, <any>'dynamicComponentSetting');

      component['rebuildComponentRef']();

      expect(sourceObject.componentRef.destroy).toHaveBeenCalled();
      expect(component['dynamicComponentSetting']).toHaveBeenCalled();
    });

    it('rebuildComponentRef: should call `getSvgContainerSize`', () => {
      const spyGetSvgContainerSize = spyOn(component, <any>'getSvgContainerSize');

      component['rebuildComponentRef']();

      expect(spyGetSvgContainerSize).toHaveBeenCalled();
    });

    it('setComponentRefProperties: should apply PoChartDynamicTypeComponent property values', () => {
      const instance: any = {
        chartHeader: { nativeElement: { offsetHeight: 200 } },
        chartLegend: { nativeElement: { offsetHeight: 200 } },
        chartWrapper: { nativeElement: { offsetWidth: 200 } }
      };

      component.height = 400;
      component['series'] = <any>[
        { category: 'A', value: 10 },
        { category: 'B', value: 10 }
      ];
      component['colors'] = ['orange', 'red'];

      component['setComponentRefProperties'](instance);

      expect(instance.height).toBe(component.height);
      expect(instance.type).toBe(component.type);
      expect(instance.series).toEqual(component['series']);
      expect(instance.colors).toEqual(component['colors']);
      expect(instance.chartHeader).toBe(component.chartHeader.nativeElement.offsetHeight);
      expect(instance.chartLegend).toBe(component.chartLegend.nativeElement.offsetHeight);
      expect(instance.chartWrapper).toBe(component.chartWrapper.nativeElement.offsetWidth);
    });

    it('setComponentRefProperties: should set `instance.colors` and `instance.series` with empty array if `colors` and `series` are undefined', () => {
      const instance: any = {};

      spyOn(component['colorService'], 'getSeriesColor').and.returnValue(undefined);

      component['chartSeries'] = undefined;
      component.chartHeader = { nativeElement: { offsetHeight: 200 } };
      component.chartLegend = { nativeElement: { offsetHeight: 200 } };
      component.chartWrapper = { nativeElement: { offsetWidth: 200 } };

      component['setComponentRefProperties'](instance);

      expect(instance.colors).toEqual([]);
      expect(instance.series).toEqual([]);
    });

    it('setClickSubscribe: should call `onSeriesClick` if onSerieClick emits an event', () => {
      const event = { data: 10 };

      const instance: any = {
        onSerieClick: of(event)
      };

      spyOn(component, <any>'onSeriesClick');

      component['setClickSubscribe'](instance);

      expect(component.onSeriesClick).toHaveBeenCalledWith(event);
    });

    it('setHoverSubscribe: should call `onSeriesHover` if onSeriesHover emits an event', () => {
      const event = { data: 11 };

      const instance: any = {
        onSerieHover: of(event)
      };

      spyOn(component, <any>'onSeriesHover');

      component['setHoverSubscribe'](instance);

      expect(component.onSeriesHover).toHaveBeenCalledWith(event);
    });

    it('setResizeListenerSubscribe: should call `getChartMeasurements` if windowResizeListener emits and apply instance property values', () => {
      const instance: any = {};

      component.chartHeader = { nativeElement: { offsetHeight: 200 } };
      component.chartLegend = { nativeElement: { offsetHeight: 200 } };
      component.chartWrapper = { nativeElement: { offsetWidth: 200 } };

      component['windowResizeListener'] = <any>of([]);

      spyOn(component, <any>'getChartMeasurements').and.callThrough();

      component['setResizeListenerSubscribe'](instance);

      expect(component['getChartMeasurements']).toHaveBeenCalled();
      expect(instance.chartHeader).toBe(component.chartHeader.nativeElement.offsetHeight);
      expect(instance.chartLegend).toBe(component.chartLegend.nativeElement.offsetHeight);
      expect(instance.chartWrapper).toBe(component.chartWrapper.nativeElement.offsetWidth);
    });

    it(`dynamicComponentSetting: should call 'createComponent', 'setResizeListenerSubscribe', 'detectChanges', 'setClickSubscribe'
      and 'setHoverSubscribe' if has type`, () => {
      spyOn(component, <any>'createComponent');
      spyOn(component, <any>'setResizeListenerSubscribe');
      spyOn(component.changeDetector, 'detectChanges');
      spyOn(component, <any>'setClickSubscribe');
      spyOn(component, <any>'setHoverSubscribe');

      component['dynamicComponentSetting']();

      expect(component['createComponent']).toHaveBeenCalled();
      expect(component['setResizeListenerSubscribe']).toHaveBeenCalled();
      expect(component.changeDetector.detectChanges).toHaveBeenCalled();
      expect(component['setClickSubscribe']).toHaveBeenCalled();
      expect(component['setHoverSubscribe']).toHaveBeenCalled();
    });

    it('getComponentType: should return component of the mappings by key', () => {
      const type = 'pie';

      expect(component['getComponentType'](type)).toBe(PoChartPieComponent);
    });

    it('onResize: should trigger onResize method when window is resized ', () => {
      const spyOnResize = spyOn(component, 'onResize');

      window.dispatchEvent(new Event('resize'));

      expect(spyOnResize).toHaveBeenCalled();
    });

    it('onResize: should call `windowResizeListener.next` and `getSvgContainerSize` if window is resized', () => {
      const spyWindowResizeListener = spyOn(component['windowResizeListener'], 'next');
      const spygetSvgContainerSize = spyOn(component, <any>'getSvgContainerSize');

      component.onResize();

      expect(spyWindowResizeListener).toHaveBeenCalled();
      expect(spygetSvgContainerSize).toHaveBeenCalled();
    });

    describe('removeWindowResizeListener:', () => {
      it('should set onResize with function if onResize is defined', () => {
        component['onResize'] = () => true;
        component['removeWindowResizeListener']();
        // tslint:disable-next-line
        expect(component['onResize']()).toBeUndefined();
      });

      it('shouldn`t set onResize with function if onResize is undefined', () => {
        component['onResize'] = undefined;

        component['removeWindowResizeListener']();

        expect(component['onResize']).toBeUndefined();
      });
    });

    it('chartLegendHeight: should return `chartLegend.nativeElement.offsetHeight` if `chartLegend` has value', () => {
      component.chartLegend = { nativeElement: { offsetHeight: 200 } };

      const expectedResult = component['chartLegendHeight'](component.chartLegend);

      expect(expectedResult).toBe(component.chartLegend.nativeElement.offsetHeight);
    });

    it('chartLegendHeight: should return `0` if `chartLegend` is undefined', () => {
      component.chartLegend = undefined;

      const expectedResult = component['chartLegendHeight'](component.chartLegend);

      expect(expectedResult).toBe(0);
    });
  });

  it('getSvgContainerSize: should call `containerService.calculateSVGContainerMeasurements` and `getChartMeasurements`', () => {
    component.categories = ['cat1', 'cat2'];
    const chartMeasurements = { chartHeaderHeight: 100, chartLegendHeight: 200, chartWrapperWidth: 300 };

    const spyCalculateSVGContainerMeasurements = spyOn(
      component['containerService'],
      'calculateSVGContainerMeasurements'
    );
    const spyGetChartMeasurements = spyOn(component, <any>'getChartMeasurements').and.returnValue(chartMeasurements);

    component['getSvgContainerSize']();

    expect(spyCalculateSVGContainerMeasurements).toHaveBeenCalledWith(
      component.height,
      chartMeasurements.chartWrapperWidth,
      chartMeasurements.chartHeaderHeight,
      chartMeasurements.chartLegendHeight,
      component.categories.length
    );
    expect(spyGetChartMeasurements).toHaveBeenCalled();
  });

  describe('Templates:', () => {
    it('should have po-chart-line-path tag if type is `Line`', () => {
      component.series = [{ category: 'catA', data: [1, 2, 3] }];
      component.type = PoChartType.Line;

      fixture.detectChanges();

      const chartContainerContent = nativeElement.querySelector('.po-chart-line-path');

      expect(chartContainerContent).toBeTruthy();
    });

    it('shouldn`t have po-chart-line-path if type is different from `Line`', () => {
      component.type = PoChartType.Pie;
      component.series = [{ category: 'catA', value: 20 }];

      fixture.detectChanges();

      const chartContainerContent = nativeElement.querySelector('.po-chart-line-path');

      expect(chartContainerContent).toBeNull();
    });
  });
});
