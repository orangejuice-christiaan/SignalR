import m from 'mithril'
import { App } from './app/App'
import './style.css'

m.mount(document.querySelector<HTMLDivElement>('[data-m-app]')!, App)