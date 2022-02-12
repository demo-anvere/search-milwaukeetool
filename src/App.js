import React from "react"
import "./App.css"
import {
	InstantSearch,
	SearchBox,
	Pagination,
	Configure,
	connectHits,
} from "react-instantsearch-dom"
import AnvereInstantSearchAdapter from "./lib/AnvereInstantsearchAdapter"

function App() {
	const anvereInstantsearchAdapter = new AnvereInstantSearchAdapter({
		server: {
			nodes: [
				{
					applicationId: "leon73sz1644638550",
					host: `search-asia.anvere.net/tvd0yGP41644638550`,
					protocol: "https",
					adminApiKey: "9f71e3208dc393e9f013807d5336da1f",
				},
			],
		},

		// additionalSearchParameters: {
		// 	queryBy: "title,authors",
		// },
	})

	const searchClient = {
		search(requests) {
			if (requests.every(({ params }) => !params.query)) {
				return Promise.resolve({
					results: requests.map(() => ({
						hits: [],
						nbHits: 0,
						nbPages: 0,
						page: 0,
						processingTimeMS: 0,
						total_docs: 0,
					})),
				})
			}

			return anvereInstantsearchAdapter.searchClient.search(requests)
		},
	}

	const Hits = ({ hits }) => {
		console.log("hits", hits)

		return (
			<ul className="searchAnvere__list">
				{hits.length > 0 ? (
					hits.map((item, index) => {
						return (
							<li className="searchAnvere__item" key={index}>
								<a
									href={`https://www.milwaukeetool.my/${item.url_key}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<img
										src={`https://www.milwaukeetool.my/media/catalog/product/cache/f69d6d03f607c5487aa6c0d8ff0727bd${item.base_image}`}
										alt={`thumbnail-${index}`}
									/>
									<span
										dangerouslySetInnerHTML={{
											__html: item["_highlightResult"]
												.name.value,
										}}
									/>
								</a>
							</li>
						)
					})
				) : (
					<li className="searchAnvere__empty">No results</li>
				)}
			</ul>
		)
	}

	const CustomHits = connectHits(Hits)

	return (
		<div className="App">
			<header className="header">
				<h1 className="header-title">
					<a href="/">Fast npm search by Anvere</a>
				</h1>
				<p className="header-subtitle">
					using&nbsp;
					<a href="https://github.com/algolia/instantsearch.js">
						Anvere + InstantSearch.js
					</a>
				</p>
			</header>
			<div className="container">
				<div className="searchAnvere">
					<InstantSearch
						indexName="84nq0js01644638586"
						searchClient={searchClient}
					>
						<SearchBox defaultRefinement="*" autoFocus />
						<CustomHits />
						<Configure hitsPerPage={10} />
						<Pagination />
					</InstantSearch>
				</div>
			</div>
		</div>
	)
}

export default App
