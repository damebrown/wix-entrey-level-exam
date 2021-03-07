import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import { sort } from '@fed-exam/config';

export type AppState = {
	tickets?: Ticket[],
	search: string,
	isDarkMode: boolean,
	sort: string,
	page: number;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		isDarkMode: false,
		sort: sort.unsorted,
		page: 1
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({ tickets: await api.getTickets(this.state.sort, this.state.page) });
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
		this.setState({
			sort: sort.email
		}
			, async () => {
				this.setState({
					tickets: await api.getTickets(this.state.sort, this.state.page)
				});
			}
		);
	}

	onClickTitleSort = (event: React.MouseEvent<HTMLElement>) => {
		console.log("Title");
		this.setState({
			sort: sort.title
		}, async () => {
			this.setState({
				tickets: await api.getTickets(this.state.sort, this.state.page)
			});
		}
		);
	}

	onClickDateSort = (event: React.MouseEvent<HTMLElement>) => {
		console.log("Date");
		this.setState({
			sort: sort.date
		}, async () => {
			this.setState({
				tickets: await api.getTickets(this.state.sort, this.state.page)
			});
		}
		);
	}

	onClickNextPage = (event: React.MouseEvent<HTMLElement>) => {
		console.log("Next");
		this.setState({
			page: this.state.page + 1
		}, async () => {
			this.setState({
				tickets: await api.getTickets(this.state.sort, this.state.page)
			});
		}
		);
	}

	onClickPrevPage = (event: React.MouseEvent<HTMLElement>) => {
		console.log("Next");
		if (this.state.page > 1) {
			this.setState({
				page: this.state.page - 1
			}, async () => {
				this.setState({
					tickets: await api.getTickets(this.state.sort, this.state.page)
				});
			}
			);
		}
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
				<div className='content'>{ticket.content} </div>
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

	renderSortingControl = () => {
		return (<><input type="button" value="Sort by Date" onClick={this.onClickDateSort} className={this.state.isDarkMode ? 'sortButton darkSort' : 'sortButton lightSort'} />
			<input type="button" value="Sort by Title" onClick={this.onClickTitleSort} className={this.state.isDarkMode ? 'sortButton darkSort' : 'sortButton lightSort'} />
			<input type="button" value="Sort by Email" onClick={this.onClickEmailSort} className={this.state.isDarkMode ? 'sortButton darkSort' : 'sortButton lightSort'} /></>);
	}

	renderPagingControl = () => {
		return (<><input type="button" value='Next Page' onClick={this.onClickNextPage} className={this.state.isDarkMode ? 'button darkButton' : 'button lightButton'} />
			<input type="button" value='Previous Page' onClick={this.onClickPrevPage} className={this.state.isDarkMode ? 'button darkButton' : 'button lightButton'} /></>);
	}

	render() {
		const { tickets } = this.state;
		let body = document.getElementsByTagName('body')[0];
		let className = this.state.isDarkMode ? "darkBody" : "body";
		body.setAttribute("className", className);
		return (
			<main>
				<input type="button" value={this.state.isDarkMode ? 'Light Mode' : 'Dark Mode'} onClick={this.onToggleDarkMode} className={this.state.isDarkMode ? 'button darkButton' : 'button lightButton'} />
				<h1 className={this.state.isDarkMode ? 'darkH1' : 'h1'}>Tickets List</h1>

				<header className={this.state.isDarkMode ? 'darkHeader' : 'lightHeader'}>
					<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)} className={this.state.isDarkMode ? 'darkSearch' : 'lightSearch'} />
				</header>
				{this.renderSortingControl()}
				{tickets ? <div className={this.state.isDarkMode ? 'darkResults' : 'results'} >Showing {tickets.length} results</div> : null}
				{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
				{this.renderPagingControl()}
			</main>
		)
	}
}

export default App;