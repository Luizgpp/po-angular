import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';

import { PoChartAxisXLabelArea, PoChartPlotAreaPaddingTop } from '../../helpers/po-chart-default-values.constant';
import { convertToInt } from '../../../../utils/util';

import { PoChartColorService } from '../../services/po-chart-color.service';
import { PoChartMathsService } from '../../services/po-chart-maths.service';

import { PoChartType } from '../../enums/po-chart-type.enum';
import { PoChartAxisOptions } from '../../interfaces/po-chart-axis-options.interface';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartMinMaxValues } from '../../interfaces/po-chart-min-max-values.interface';
import { PoChartPathCoordinates } from '../../interfaces/po-chart-path-coordinates.interface';
import { PoChartPointsCoordinates } from '../../interfaces/po-chart-points-coordinates.interface';
import { PoLineChartSeries } from '../../interfaces/po-chart-line-series.interface';

@Component({
  selector: '[po-chart-line]',
  templateUrl: './po-chart-line.component.svg'
})
export class PoChartLineComponent {
  colors: Array<string>;
  seriesPathsCoordinates: Array<PoChartPathCoordinates>;
  seriesPointsCoordinates: Array<Array<PoChartPointsCoordinates>> = [];

  private minMaxSeriesValues: PoChartMinMaxValues;
  private seriesLength: number;
  private firstValidItemFromSerieArray: boolean;

  private _containerSize: PoChartContainerSize = {};
  private _options: PoChartAxisOptions;
  private _series: Array<PoLineChartSeries> = [];

  @Input('p-categories') categories: Array<string>;

  @Input('p-container-size') set containerSize(value: PoChartContainerSize) {
    this._containerSize = value;

    this.getDomainValues(this.series, this.options);
    this.seriePathPointsDefinition(this._containerSize, this.series, this.minMaxSeriesValues);
  }

  get containerSize() {
    return this._containerSize;
  }

  @Input('p-series') set series(value: Array<PoLineChartSeries>) {
    this._series = value;

    this.seriesLength = this.mathsService.seriesGreaterLength(this.series);
    this.colors = this.colorService.getSeriesColor(this._series, PoChartType.Line);
    this.getDomainValues(this._series, this.options);
    this.seriePathPointsDefinition(this.containerSize, this._series, this.minMaxSeriesValues);
  }

  get series() {
    return this._series;
  }

  @Input('p-options') set options(value: PoChartAxisOptions) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._options = value;

      this.getDomainValues(this.series, this._options);
      this.seriePathPointsDefinition(this.containerSize, this._series, this.minMaxSeriesValues);
    }
  }

  @Output('p-point-click') pointClick = new EventEmitter<any>();

  @Output('p-point-hover') pointHover = new EventEmitter<any>();

  get options() {
    return this._options;
  }

  @ViewChild('chartLine') chartLine: ElementRef;

  constructor(
    private colorService: PoChartColorService,
    private mathsService: PoChartMathsService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  onSeriePointClick(selectedItem: any) {
    this.pointClick.emit(selectedItem);
  }

  onSeriePointHover(selectedItem: any) {
    const { relativeTo, ...item } = selectedItem;

    this.reorderSVGGroup(relativeTo);
    this.pointHover.emit(item);
  }

  trackBy(index) {
    return index;
  }

  private getDomainValues(series: Array<PoLineChartSeries>, options: PoChartAxisOptions = {}): void {
    const seriesMinMaxValues: PoChartMinMaxValues = this.mathsService.calculateMinAndMaxValues(series);

    const minValue = options.minRange < seriesMinMaxValues.minValue ? options.minRange : seriesMinMaxValues.minValue;
    const maxValue = options.maxRange > seriesMinMaxValues.maxValue ? options.maxRange : seriesMinMaxValues.maxValue;

    this.minMaxSeriesValues = { minValue, maxValue };
  }

  private seriePathPointsDefinition(
    containerSize: PoChartContainerSize,
    series: Array<PoLineChartSeries>,
    minMaxSeriesValues: PoChartMinMaxValues
  ) {
    this.seriesPointsCoordinates = [];

    this.seriesPathsCoordinates = series.map((serie: PoLineChartSeries) => {
      if (Array.isArray(serie.data)) {
        let pathCoordinates: string = '';
        let pointCoordinates: Array<PoChartPointsCoordinates> = [];
        this.firstValidItemFromSerieArray = true;

        serie.data.forEach((serieValue, index) => {
          if (convertToInt(serieValue)) {
            const svgPathCommand = this.svgPathCommand();
            const xCoordinate = this.xCoordinate(index, containerSize);
            const yCoordinate = this.yCoordinate(minMaxSeriesValues, serieValue, containerSize);
            const axisCategory = this.axisYCategory(index, this.categories);
            const category = serie['category'];
            const label = this.serieLabel(category, serieValue);

            pointCoordinates = [
              ...pointCoordinates,
              { axisCategory, category, label, value: serieValue, xCoordinate, yCoordinate }
            ];
            pathCoordinates += ` ${svgPathCommand}${xCoordinate} ${yCoordinate}`;
          }
        });
        this.seriesPointsCoordinates = [...this.seriesPointsCoordinates, pointCoordinates];

        return { coordinates: pathCoordinates };
      }
    });
  }

  private svgPathCommand() {
    const command = this.firstValidItemFromSerieArray ? 'M' : 'L';
    // firstValidItemFromSerieArray: tratamento para permitir ao usuário definir o primeiro valor como null para que seja ignorado;
    this.firstValidItemFromSerieArray = false;

    return command;
  }

  private serieLabel(category: string, serieValue: number) {
    return `${category}: ${serieValue}`;
  }

  private xCoordinate(index: number, containerSize: PoChartContainerSize) {
    const xRatio = index / (this.seriesLength - 1);
    const svgAxisSideSpacing = this.mathsService.calculateSideSpacing(containerSize.svgWidth, this.seriesLength);

    return PoChartAxisXLabelArea + svgAxisSideSpacing + containerSize.svgPlottingAreaWidth * xRatio;
  }

  private axisYCategory(index: number, categories: Array<string> = []) {
    return categories[index] ?? undefined;
  }

  private yCoordinate(
    minMaxSeriesValues: PoChartMinMaxValues,
    serieValue: number,
    containerSize: PoChartContainerSize
  ) {
    const yRratio = this.mathsService.getSeriePercentage(minMaxSeriesValues, serieValue);
    const yCoordinate =
      containerSize.svgPlottingAreaHeight - containerSize.svgPlottingAreaHeight * yRratio + PoChartPlotAreaPaddingTop;

    return Math.floor(yCoordinate);
  }

  // É necessário reordenar os svgs on hover pois eventualmente os elemntos svg ficam por trás de outros. Não há z-index para svgElement.
  private reorderSVGGroup(pathGroup: string) {
    const pathGroupElement = this.elementRef.nativeElement.querySelectorAll(`.${pathGroup}`);

    this.renderer.appendChild(this.chartLine.nativeElement, pathGroupElement[0]);
  }
}
