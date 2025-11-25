import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import m from "mithril";
import { MithrilTsxComponent } from "mithril-tsx-component";
import { Chart } from "./Chart";

const BASE_API_URL = "https://localhost:7124";
const USERNAME_SESSION_KEY = "signalr-dashboard-username";

export class App extends MithrilTsxComponent<{}> {
    username: string | undefined;
    data: any[] = [];
    pendingUsername = "";
    isUsernameDialogOpen = true;
    connection: HubConnection | undefined;
    users: { connectionId: string, username: string }[] = [];

    private closeUsernameDialog() {
        if (!this.pendingUsername.trim()) {
            return;
        }

        const sanitizedUsername = this.pendingUsername.trim();
        this.username = sanitizedUsername;

        if (typeof sessionStorage !== "undefined") {
            sessionStorage.setItem(USERNAME_SESSION_KEY, sanitizedUsername);
        }

        this.connection?.invoke("SetUsername", this.username);
        this.isUsernameDialogOpen = false;
        this.pendingUsername = "";
        m.redraw();
    }

    async oninit() {
        if (typeof sessionStorage !== "undefined") {
            const storedUsername = sessionStorage.getItem(USERNAME_SESSION_KEY);

            if (storedUsername) {
                this.username = storedUsername;
                this.isUsernameDialogOpen = false;
            }
        }

        this.connection = new HubConnectionBuilder()
            .withUrl(`${BASE_API_URL}/dashboardHub`, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets,
            })
            .configureLogging(LogLevel.Information)
            .build();

        this.connection.on("ReceiveData", (data: any) => {
            this.data = data;
            m.redraw();
        });

        this.connection.on("UpdateUsers", (data: { connectionId: string, username: string }[]) => {
            this.users = data;
            m.redraw();
        });

        this.connection.start().then(() => {
            console.log("Connected to the hub");

            if (this.username) {
                this.connection?.invoke("SetUsername", this.username);
            }
        }).catch((err) => {
            console.error("Error connecting to the hub", err);
        });
    }

    view() {
        return (
            <div class="flex flex-col items-center justify-center h-screen bg-white">
                <div class="grid grid-cols-2 grid-rows-2 gap-8 px-24 py-12 w-full h-full">
                    <div class="p-4 rounded-xl border border-slate-200 w-full h-full">
                        <Chart className="w-full h-full aspect-video" data={this.data} />
                    </div>
                    <div class="flex flex-col gap-4 p-4 rounded-xl border border-slate-200 w-full h-full">
                        <h1 class="text-2xl font-semibold text-slate-700">Messages</h1>
                        <div class="h-px bg-slate-200 w-full"></div>
                    </div>
                    <div class="flex flex-col gap-4 p-4 rounded-xl border border-slate-200 w-full h-full">
                        <h1 class="text-2xl font-semibold text-slate-700">Users</h1>
                        <div class="h-px bg-slate-200 w-full"></div>
                        <div class="flex flex-col gap-2">
                            {this.users.map((user) => (
                                <div class="flex items-center gap-2">
                                    <span class="text-lg font-medium text-slate-500">{user.username}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {this.isUsernameDialogOpen && (
                    <div class="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm">
                        <div class="bg-white rounded-xl shadow-2xl p-6 w-96 flex flex-col gap-4">
                            <div>
                                <h2 class="text-xl font-semibold text-slate-800">Welcome!</h2>
                                <p class="text-sm text-slate-500">Please enter a username to get started.</p>
                            </div>
                            <input
                                type="text"
                                class="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g. data-nerd-42"
                                value={this.pendingUsername}
                                oninput={(event: InputEvent) => {
                                    const target = event.target as HTMLInputElement;
                                    this.pendingUsername = target.value;
                                }}
                            />
                            <button
                                class={`rounded-lg px-4 py-2 text-white font-medium transition ${this.pendingUsername.trim()
                                    ? "bg-indigo-600 hover:bg-indigo-500"
                                    : "bg-slate-300 cursor-not-allowed"
                                    }`}
                                disabled={!this.pendingUsername.trim()}
                                onclick={() => this.closeUsernameDialog()}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}