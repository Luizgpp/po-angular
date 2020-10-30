import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoTooltipModule } from '../../directives/po-tooltip/po-tooltip.module';

import { PoChartAxisComponent } from './po-chart-container/po-chart-axis/po-chart-axis.component';
import { PoChartAxisXComponent } from './po-chart-container/po-chart-axis/po-chart-axis-x/po-chart-axis-x.component';
import { PoChartAxisYComponent } from './po-chart-container/po-chart-axis/po-chart-axis-y/po-chart-axis-y.component';
import { PoChartAxisXLabelComponent } from './po-chart-container/po-chart-axis/po-chart-axis-x-label/po-chart-axis-x-label.component';
import { PoChartAxisYLabelComponent } from './po-chart-container/po-chart-axis/po-chart-axis-y-label/po-chart-axis-y-label.component';
import { PoChartComponent } from './po-chart.component';
import { PoChartContainerComponent } from './po-chart-container/po-chart-container.component';
import { PoChartDonutComponent } from './po-chart-types/po-chart-donut/po-chart-donut.component';
import { PoChartGaugeComponent } from './po-chart-types/po-chart-gauge/po-chart-gauge.component';
import { PoChartGaugeTextContentComponent } from './po-chart-types/po-chart-gauge/po-chart-gauge-text-content/po-chart-gauge-text-content.component';
import { PoChartLegendComponent } from './po-chart-legend/po-chart-legend.component';
import { PoChartLineComponent } from './po-chart-container/po-chart-line/po-chart-line.component';
import { PoChartPathComponent } from './po-chart-container/po-chart-line/po-chart-path/po-chart-path.component';
import { PoChartPieComponent } from './po-chart-types/po-chart-pie/po-chart-pie.component';
import { PoChartSeriesPointComponent } from './po-chart-container/po-chart-line/po-chart-series-point/po-chart-series-point.component';

/**
 * @description
 *
 * Módulo do componente `po-chart`.
 */
@NgModule({
  imports: [CommonModule, PoTooltipModule],
  declarations: [
    PoChartAxisComponent,
    PoChartAxisXComponent,
    PoChartAxisYComponent,
    PoChartAxisXLabelComponent,
    PoChartAxisYLabelComponent,
    PoChartComponent,
    PoChartContainerComponent,
    PoChartDonutComponent,
    PoChartGaugeComponent,
    PoChartGaugeTextContentComponent,
    PoChartLegendComponent,
    PoChartLineComponent,
    PoChartPathComponent,
    PoChartPieComponent,
    PoChartSeriesPointComponent
  ],
  exports: [PoChartComponent]
})
export class PoChartModule {}
