import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';

export type AppState = {
	tickets?: Ticket[],
	search: string,
	isDarkMode: boolean,
	sort: string;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		isDarkMode: false,
		sort: ''
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

	onClickEmailSort = (event: React.MouseEvent<HTMLElement>) => {
		this.setState({ sort: "email" });
	}

	onClickTitleSort = (event: React.MouseEvent<HTMLElement>) => {
		this.setState({ sort: "title" });
	}

	onClickDateSort = (event: React.MouseEvent<HTMLElement>) => {
		this.setState({ sort: "date" });
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
		let body = document.getElementsByTagName('body')[0];
		// let color = this.state.isDarkMode ? "#000" : "#f5f9fc";
		// body.setAttribute("background-color", color);
		let className = this.state.isDarkMode ? "darkBody" : "body";
		body.setAttribute("className", className);
		return (
			// <body style="background-color:red;" className={this.state.isDarkMode ? "darkBody" : "body"}>
			<main>
				<input type="button" value={this.state.isDarkMode ? 'Light Mode' : 'Dark Mode'} onClick={this.onToggleDarkMode} className={this.state.isDarkMode ? 'button darkButton' : 'button lightButton'} />
				<h1 className={this.state.isDarkMode ? 'darkH1' : 'h1'}>Tickets List</h1>

				<header className={this.state.isDarkMode ? 'darkHeader' : 'lightHeader'}>
					<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)} className={this.state.isDarkMode ? 'darkSearch' : 'lightSearch'} />
				</header>
				<input type="button" value="Sort by Date" onClick={this.onClickDateSort} className={this.state.isDarkMode ? 'sortButton darkSort' : 'sortButton lightSort'} />
				<input type="button" value="Sort by Title" onClick={this.onClickTitleSort} className={this.state.isDarkMode ? 'sortButton darkSort' : 'sortButton lightSort'} />
				<input type="button" value="Sort by Email" onClick={this.onClickEmailSort} className={this.state.isDarkMode ? 'sortButton darkSort' : 'sortButton lightSort'} />
				{tickets ? <div className={this.state.isDarkMode ? 'darkResults' : 'results'} >Showing {tickets.length} results</div> : null}
				{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			</main>
			// </body>
		)
	}
}

export default App;