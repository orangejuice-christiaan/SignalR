import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import m from "mithril";
import { MithrilTsxComponent } from "mithril-tsx-component";
import { Chart } from "./Chart";

const BASE_API_URL = "https://localhost:7124";

export class App extends MithrilTsxComponent<{}> {
    data: any[] = [];

    async oninit() {
        const connection = new HubConnectionBuilder()
            .withUrl(`${BASE_API_URL}/dashboardHub`, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets,
            })
            .configureLogging(LogLevel.Information)
            .build();

        connection.on("ReceiveData", (data: any) => {
            this.data = data;
            m.redraw();
        });

        connection.start().then(() => {
            console.log("Connected to the hub");
        }).catch((err) => {
            console.error("Error connecting to the hub", err);
        });
    }

    view() {
        return (
            <div class="flex flex-col items-center justify-center h-screen">
                <Chart data={this.data} />
            </div>
        );
    }
}