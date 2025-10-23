import m from "mithril";
import { MithrilTsxComponent } from "mithril-tsx-component";
import { Chart as ChartJS, LinearScale, LineController, LineElement, PointElement, CategoryScale } from 'chart.js';

interface IChart {
    data: any;
    onDataChange: (chart: ChartJS) => void;
}

export class Chart extends MithrilTsxComponent<IChart> {
    chart: ChartJS | null = null;

    oninit() {
        ChartJS.register(LinearScale, LineController, LineElement, PointElement, CategoryScale);
    }

    oncreate({ attrs: { data } }: { attrs: IChart }) {
        const canvas = document.getElementById("chart") as HTMLCanvasElement;
        if (!canvas) {
            return;
        }

        this.chart = new ChartJS(canvas, {
            type: "line",
            data: {
                labels: data.map((item: any) => item.time),
                datasets: [{
                    data: data.map((item: any) => item.value),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    pointRadius: 0,
                    animation: {
                        duration: 0,
                        easing: 'easeOutQuad'
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: false
                    }
                }
            }
        });
    }

    onupdate({ attrs: { data } }: { attrs: IChart }) {
        if (this.chart) {
            this.chart.data.labels = data.map((item: any) => item.time);
            this.chart.data.datasets[0].data = data.map((item: any) => item.value);
            this.chart.update();
        }
    }

    view() {
        return (
            <div class="w-[800px] h-[400px]"><canvas id="chart"></canvas></div>
        );
    }
}