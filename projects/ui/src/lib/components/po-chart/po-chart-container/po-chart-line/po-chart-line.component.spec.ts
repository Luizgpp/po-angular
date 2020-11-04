import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectPropertiesValues } from '../../../../util-test/util-expect.spec';

import { PoChartLineComponent } from './po-chart-line.component';
import { PoChartType } from '../../enums/po-chart-type.enum';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartModule } from '../../po-chart.module';

describe('PoChartLineComponent', () => {
  let component: PoChartLineComponent;
  let fixture: ComponentFixture<PoChartLineComponent>;

  const series = [
    { category: 'category', data: [1, 2, 3] },
    { category: 'category B', data: [10, 20, 30] }
  ];
  const containerSize: PoChartContainerSize = {
    svgWidth: 200,
    svgHeight: 200,
    svgPlottingAreaWidth: 20,
    svgPlottingAreaHeight: 20
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoChartModule],
      declarations: [PoChartLineComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartLineComponent);
    component = fixture.componentInstance;
    component.series = series;
    component.containerSize = containerSize;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onSeriePointClick: should emit `pointClick`', () => {
      const selectedItem = { category: 'cat', value: 200 };

      const spyPointClick = spyOn(component.pointClick, 'emit');

      component.onSeriePointClick(selectedItem);

      expect(spyPointClick).toHaveBeenCalledWith(selectedItem);
    });

    it('onSeriePointHover: should emit `pointHover` and call `reorderSVGGroup`', () => {
      const selectedItem = { relativeTo: 'po-chart-path-1', category: 'Vancouver', value: 200 };

      const spyReorderSVGGroup = spyOn(component, <any>'reorderSVGGroup');
      const spyPointHover = spyOn(component.pointHover, 'emit');

      component.onSeriePointHover(selectedItem);

      expect(spyPointHover).toHaveBeenCalledWith({ category: 'Vancouver', value: 200 });
      expect(spyReorderSVGGroup).toHaveBeenCalledWith('po-chart-path-1');
    });

    it('trackBy: should return index param', () => {
      const index = 1;
      const expectedValue = index;

      expect(component.trackBy(index)).toBe(expectedValue);
    });

    it('getDomainValues: should apply value to `minMaxSeriesValues` with the min and max series values', () => {
      component.options = undefined;
      component['getDomainValues'](component.options);

      expect(component['minMaxSeriesValues']).toEqual({ minValue: 1, maxValue: 30 });
    });

    it('getDomainValues: should apply value to `minMaxSeriesValues` with the min and max values of `options`', () => {
      component.options = { minRange: -10, maxRange: 50 };
      component['getDomainValues'](component.options);

      expect(component['minMaxSeriesValues']).toEqual({ minValue: -10, maxValue: 50 });
    });

    describe('seriePathPointsDefinition: ', () => {
      it('should call `svgPathCommand`, `xCoordinate`, `yCoordinate`, `axisYCategory` and `serieLabel`', () => {
        const minMaxSeriesValues = { minValue: 0, maxValue: 30 };

        const spySvgPathCommand = spyOn(component, <any>'svgPathCommand');
        const spyXCoordinate = spyOn(component, <any>'xCoordinate');
        const spyYCoordinate = spyOn(component, <any>'yCoordinate');
        const spyAxisYCategory = spyOn(component, <any>'axisYCategory');
        const spySerieLabel = spyOn(component, <any>'serieLabel');

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        expect(spySvgPathCommand).toHaveBeenCalled();
        expect(spyXCoordinate).toHaveBeenCalled();
        expect(spyYCoordinate).toHaveBeenCalled();
        expect(spyAxisYCategory).toHaveBeenCalled();
        expect(spySerieLabel).toHaveBeenCalled();
      });

      it('should apply apply value to `seriesPathsCoordinates`', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        component.series = [{ category: 'Vancouver', data: [5, 10] }];

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        const expectedResult = [{ coordinates: ' M72 28 L92 8' }];

        expect(component.seriesPathsCoordinates).toEqual(expectedResult);
        expect(component.seriesPathsCoordinates.length).toBe(1);
      });

      it('should apply apply value to `seriesPointsCoordinates`', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        component.series = [{ category: 'Vancouver', data: [5, 10] }];

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        const expectedResult = [
          [
            {
              axisCategory: undefined,
              category: 'Vancouver',
              label: 'Vancouver: 5',
              value: 5,
              xCoordinate: 72,
              yCoordinate: 28
            },
            {
              axisCategory: undefined,
              category: 'Vancouver',
              label: 'Vancouver: 10',
              value: 10,
              xCoordinate: 92,
              yCoordinate: 8
            }
          ]
        ];

        expect(component.seriesPointsCoordinates).toEqual(expectedResult);
        expect(component.seriesPointsCoordinates.length).toBe(1);
        expect(component.seriesPointsCoordinates[0].length).toBe(2);
      });

      it('should apply apply value to `seriesPointsCoordinates` passing `categories` value of each one', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        component.series = [{ category: 'Vancouver', data: [5, 10] }];
        component.categories = ['janeiro', 'fevereiro'];

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        const expectedResult = [
          [
            {
              axisCategory: 'janeiro',
              category: 'Vancouver',
              label: 'Vancouver: 5',
              value: 5,
              xCoordinate: 72,
              yCoordinate: 28
            },
            {
              axisCategory: 'fevereiro',
              category: 'Vancouver',
              label: 'Vancouver: 10',
              value: 10,
              xCoordinate: 92,
              yCoordinate: 8
            }
          ]
        ];

        expect(component.seriesPointsCoordinates).toEqual(expectedResult);
        expect(component.seriesPointsCoordinates.length).toBe(1);
        expect(component.seriesPointsCoordinates[0].length).toBe(2);
      });

      it('should ignore to coordinates the serie.data which it`s value is null', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        const series = [{ category: 'Vancouver', data: [10, null, 12] }];
        component.categories = ['janeiro', 'fevereiro', 'março'];

        const expectedPointsResult = [
          [
            {
              axisCategory: 'janeiro',
              category: 'Vancouver',
              label: 'Vancouver: 10',
              value: 10,
              xCoordinate: 72,
              yCoordinate: 8
            },
            {
              axisCategory: 'março',
              category: 'Vancouver',
              label: 'Vancouver: 12',
              value: 12,
              xCoordinate: 92,
              yCoordinate: 0
            }
          ]
        ];

        component['seriePathPointsDefinition'](component.containerSize, <any>series, minMaxSeriesValues);

        expect(component.seriesPointsCoordinates).toEqual(expectedPointsResult);
        expect(component.seriesPathsCoordinates).toEqual([{ coordinates: ' M72 8 L92 0' }]);
      });

      it('shouldn`t apply values to `seriesPointsCoordinates` neither to `seriesPathsCoordinates` if series.data isn`t an array', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        const series = [{ category: 'Vancouver', data: 12 }];

        component['seriePathPointsDefinition'](component.containerSize, <any>series, minMaxSeriesValues);

        expect(component.seriesPointsCoordinates).toEqual([]);
        expect(component.seriesPointsCoordinates.length).toBe(0);
        expect(component.seriesPathsCoordinates).toEqual([undefined]);
      });
    });

    it('reorderSVGGroup: should call `renderer.appendChild` and `querySelectorAll`', () => {
      const pathGroup = 'po-chart-line-path-group-0';

      const spyAppendChild = spyOn(component['renderer'], 'appendChild');

      component['reorderSVGGroup'](pathGroup);

      expect(spyAppendChild).toHaveBeenCalled();
    });
  });

  describe('Properties:', () => {
    it('p-container-size: should call `getDomainValues` and `seriePathPointsDefinition`', () => {
      const spyGetDomainValues = spyOn(component, <any>'getDomainValues');
      const spySeriePathPointsDefinition = spyOn(component, <any>'seriePathPointsDefinition');

      component.containerSize = containerSize;

      expect(spyGetDomainValues).toHaveBeenCalledWith(component.options);
      expect(spySeriePathPointsDefinition).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component['minMaxSeriesValues']
      );
    });

    it('p-series: should call `calculateMinAndMaxValues`, `getDomainValues`, `seriePathPointsDefinition`, `seriesGreaterLength` and `getSeriesColor`', () => {
      const type = PoChartType.Line;
      const spySeriesGreaterLength = spyOn(component['mathsService'], <any>'seriesGreaterLength');
      const spyGetSeriesColor = spyOn(component['colorService'], 'getSeriesColor');
      const spyGetDomainValues = spyOn(component, <any>'getDomainValues');
      const spySeriePathPointsDefinition = spyOn(component, <any>'seriePathPointsDefinition');

      component.series = series;

      expect(spySeriesGreaterLength).toHaveBeenCalledWith(component.series);
      expect(spyGetSeriesColor).toHaveBeenCalledWith(component.series, type);
      expect(spyGetDomainValues).toHaveBeenCalledWith(component.options);
      expect(spySeriePathPointsDefinition).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component['minMaxSeriesValues']
      );
    });

    it('p-options: should update property if valid values', () => {
      const validValues = [{}, { axisXGridLines: 5 }];

      expectPropertiesValues(component, 'options', validValues, validValues);
    });

    it('p-options: shouldn`t update property if invalid values', () => {
      const invalidValues = [undefined, null, '', false, 0, ['1'], [{ key: 'value' }]];

      expectPropertiesValues(component, 'options', invalidValues, undefined);
    });

    it('p-options: should call `getDomainValues` and `seriePathPointsDefinition`', () => {
      const spyGetDomainValues = spyOn(component, <any>'getDomainValues');
      const spySeriePathPointsDefinition = spyOn(component, <any>'seriePathPointsDefinition');

      component.options = { axisXGridLines: 5, maxRange: 100, minRange: 0 };

      expect(spyGetDomainValues).toHaveBeenCalledWith(component.options);
      expect(spySeriePathPointsDefinition).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component['minMaxSeriesValues']
      );
    });
  });
});
