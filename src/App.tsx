import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';

export type AppState = {
	tickets?: Ticket[],
	search: string,
	isDarkMode: boolean;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		isDarkMode: false
	}


	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets()
		});
	}

	onRenameClick = (ticketId: string) => {
		let newName = window.prompt("Rename this ticket: ");
		if (this.state.tickets) {
			this.setState({ tickets: this.state.tickets.map((ticket) => ticket.id === ticketId ? Object.assign(ticket, { title: newName }) : ticket) });
		}
	}

	onToggleDarkMode = (event: React.MouseEvent<HTMLElement>) => {
		this.setState({ isDarkMode: !this.state.isDarkMode });
	}

	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));


		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className={this.state.isDarkMode ? 'darkTicket' : 'lightTicket'}>
				<h5 className='title'>{ticket.title}</h5>
				<form>
					<button key={ticket.id} className='rename' onClick={(e) => { e.preventDefault(); this.onRenameClick(ticket.id); }}>Rename Title</button>
				</form>
				<p>
					<div className='content'>{ticket.content} </div>
				</p>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | {new Date(ticket.creationTime).toLocaleString()}</div>
				</footer>
			</li>))}
		</ul>);
	}



	onSearch = async (val: string, newPage?: number) => {

		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}

	render() {
		const { tickets } = this.state;

		return (<main>
			{/* <body ={this.state.isDarkMode ? "background-color: white" : "background-color: black"}> */}
			<h1 className={this.state.isDarkMode ? 'darkH1' : 'h1'}>Tickets List</h1>
			<input type="button" value={this.state.isDarkMode ? 'Light Mode' : 'Dark Mode'} onClick={this.onToggleDarkMode} className={this.state.isDarkMode ? 'darkButton' : 'lightButton'} />
			<header className={this.state.isDarkMode ? 'darkHeader' : 'lightHeader'}>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)} className={this.state.isDarkMode ? 'darkSearch' : 'lightSearch'} />
			</header>
			{tickets ? <div className={this.state.isDarkMode ? 'darkResults' : 'results'} >Showing {tickets.length} results</div> : null}
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			{/* </body>s */}
		</main>)
	}
}

export default App;