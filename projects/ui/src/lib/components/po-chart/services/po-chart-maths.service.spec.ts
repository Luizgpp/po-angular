import { TestBed } from '@angular/core/testing';

import { PoChartMathsService } from './po-chart-maths.service';

describe('PoChartMathsService', () => {
  let service: PoChartMathsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoChartMathsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Methods:', () => {
    it('calculateMinAndMaxValues: should return the maximum and minimum series values', () => {
      const series = [
        { category: 'A', data: [-20, 20, 45] },
        { category: 'B', data: [200, 170, 210] }
      ];
      const expectedResult = { minValue: -20, maxValue: 210 };

      expect(service.calculateMinAndMaxValues(series)).toEqual(expectedResult);
    });

    it('calculateMinAndMaxValues: should return 0 for minValue if series values minimum value is greater than 0', () => {
      const series = [
        { category: 'A', data: [40, 20, 45] },
        { category: 'B', data: [200, 170, 210] }
      ];
      const expectedResult = { minValue: 0, maxValue: 210 };

      expect(service.calculateMinAndMaxValues(series)).toEqual(expectedResult);
    });

    it('range: should call `getAxisXGridLineArea` and return a list of values according with axisXGridLabels default value', () => {
      const minMaxValues = { minValue: 0, maxValue: 200 };
      const expectedResult = [0, 50, 100, 150, 200];
      const axisXGridLines = 5;

      const spyGetAxisXGridLineArea = spyOn(service, <any>'getAxisXGridLineArea').and.callThrough();

      expect(service.range(minMaxValues)).toEqual(expectedResult);
      expect(spyGetAxisXGridLineArea).toHaveBeenCalledWith(minMaxValues, axisXGridLines);
    });

    it('range: return a list of values according with axisXGridLabels passed value', () => {
      const minMaxValues = { minValue: 0, maxValue: 200 };
      const expectedResult = [0, 100, 200];
      const axisXGridLines = 3;

      const spyGetAxisXGridLineArea = spyOn(service, <any>'getAxisXGridLineArea').and.callThrough();

      expect(service.range(minMaxValues, axisXGridLines)).toEqual(expectedResult);
      expect(spyGetAxisXGridLineArea).toHaveBeenCalledWith(minMaxValues, axisXGridLines);
    });

    it('calculateSideSpacing: should return value referring to space between label x and serie`s plot', () => {
      const containerWidth = 200;
      const seriesLength = 7;

      expect(service.calculateSideSpacing(containerWidth, seriesLength)).toBe(10);
    });

    it('calculateSideSpacing: should return 24 referring to space between label x and serie`s plot if halfCategoryWidth exceeds the limit of 24', () => {
      const containerWidth = 200;
      const seriesLength = 2;

      expect(service.calculateSideSpacing(containerWidth, seriesLength)).toBe(24);
    });

    it('seriesGreaterLength: should return the serie`s greater length value', () => {
      const series = [
        { label: 'A', data: [-20, 20, 45] },
        { label: 'B', data: [200, 170, 210, 40, 200] },
        { label: 'B', data: [200, 210, 200] }
      ];

      expect(service.seriesGreaterLength(series)).toBe(5);
    });

    it('getSeriePercentage: should calulate the percentage in decimals.', () => {
      const minMaxValues = { minValue: 0, maxValue: 200 };
      const serieValue = 20;

      expect(service.getSeriePercentage(minMaxValues, serieValue)).toBe(0.1);
    });
  });
});
