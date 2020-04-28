--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

-- Started on 2020-04-28 12:15:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 208 (class 1259 OID 16922)
-- Name: articles; Type: TABLE; Schema: public; Owner: academy
--

CREATE TABLE public.articles (
    id bigint NOT NULL,
    author_id bigint NOT NULL,
    title character varying(255) NOT NULL,
    img character varying(255),
    announce text,
    full_text text NOT NULL,
    date_create timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.articles OWNER TO academy;

--
-- TOC entry 207 (class 1259 OID 16920)
-- Name: articles_author_id_seq; Type: SEQUENCE; Schema: public; Owner: academy
--

CREATE SEQUENCE public.articles_author_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.articles_author_id_seq OWNER TO academy;

--
-- TOC entry 2897 (class 0 OID 0)
-- Dependencies: 207
-- Name: articles_author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: academy
--

ALTER SEQUENCE public.articles_author_id_seq OWNED BY public.articles.author_id;


--
-- TOC entry 212 (class 1259 OID 16944)
-- Name: articles_category; Type: TABLE; Schema: public; Owner: academy
--

CREATE TABLE public.articles_category (
    id bigint NOT NULL,
    article_id bigint NOT NULL,
    category_id bigint NOT NULL
);


ALTER TABLE public.articles_category OWNER TO academy;

--
-- TOC entry 210 (class 1259 OID 16940)
-- Name: articles_category_article_id_seq; Type: SEQUENCE; Schema: public; Owner: academy
--

CREATE SEQUENCE public.articles_category_article_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.articles_category_article_id_seq OWNER TO academy;

--
-- TOC entry 2898 (class 0 OID 0)
-- Dependencies: 210
-- Name: articles_category_article_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: academy
--

ALTER SEQUENCE public.articles_category_article_id_seq OWNED BY public.articles_category.article_id;


--
-- TOC entry 211 (class 1259 OID 16942)
-- Name: articles_category_category_id_seq; Type: SEQUENCE; Schema: public; Owner: academy
--

CREATE SEQUENCE public.articles_category_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.articles_category_category_id_seq OWNER TO academy;

--
-- TOC entry 2899 (class 0 OID 0)
-- Dependencies: 211
-- Name: articles_category_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: academy
--

ALTER SEQUENCE public.articles_category_category_id_seq OWNED BY public.articles_category.category_id;


--
-- TOC entry 209 (class 1259 OID 16938)
-- Name: articles_category_id_seq; Type: SEQUENCE; Schema: public; Owner: academy
--

CREATE SEQUENCE public.articles_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.articles_category_id_seq OWNER TO academy;

--
-- TOC entry 2900 (class 0 OID 0)
-- Dependencies: 209
-- Name: articles_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: academy
--

ALTER SEQUENCE public.articles_category_id_seq OWNED BY public.articles_category.id;


--
-- TOC entry 206 (class 1259 OID 16918)
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: academy
--

CREATE SEQUENCE public.articles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.articles_id_seq OWNER TO academy;

--
-- TOC entry 2901 (class 0 OID 0)
-- Dependencies: 206
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: academy
--

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;


--
-- TOC entry 203 (class 1259 OID 16904)
-- Name: categories; Type: TABLE; Schema: public; Owner: academy
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    title character varying(100) NOT NULL
);


ALTER TABLE public.categories OWNER TO academy;

--
-- TOC entry 202 (class 1259 OID 16902)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: academy
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO academy;

--
-- TOC entry 2902 (class 0 OID 0)
-- Dependencies: 202
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: academy
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 216 (class 1259 OID 16968)
-- Name: comments; Type: TABLE; Schema: public; Owner: academy
--

CREATE TABLE public.comments (
    id bigint NOT NULL,
    article_id bigint NOT NULL,
    author_id bigint NOT NULL,
    text text NOT NULL,
    date_create timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.comments OWNER TO academy;

--
-- TOC entry 214 (class 1259 OID 16964)
-- Name: comments_article_id_seq; Type: SEQUENCE; Schema: public; Owner: academy
--

CREATE SEQUENCE public.comments_article_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_article_id_seq OWNER TO academy;

--
-- TOC entry 2903 (class 0 OID 0)
-- Dependencies: 214
-- Name: comments_article_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: academy
--

ALTER SEQUENCE public.comments_article_id_seq OWNED BY public.comments.article_id;


--
-- TOC entry 215 (class 1259 OID 16966)
-- Name: comments_author_id_seq; Type: SEQUENCE; Schema: public; Owner: academy
--

CREATE SEQUENCE public.comments_author_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_author_id_seq OWNER TO academy;

--
-- TOC entry 2904 (class 0 OID 0)
-- Dependencies: 215
-- Name: comments_author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: academy
--

ALTER SEQUENCE public.comments_author_id_seq OWNED BY public.comments.author_id;


--
-- TOC entry 213 (class 1259 OID 16962)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: academy
--

CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO academy;

--
-- TOC entry 2905 (class 0 OID 0)
-- Dependencies: 213
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: academy
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- TOC entry 205 (class 1259 OID 16912)
-- Name: users; Type: TABLE; Schema: public; Owner: academy
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    surname character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL
);


ALTER TABLE public.users OWNER TO academy;

--
-- TOC entry 204 (class 1259 OID 16910)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: academy
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO academy;

--
-- TOC entry 2906 (class 0 OID 0)
-- Dependencies: 204
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: academy
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2725 (class 2604 OID 16925)
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);


--
-- TOC entry 2726 (class 2604 OID 16926)
-- Name: articles author_id; Type: DEFAULT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles ALTER COLUMN author_id SET DEFAULT nextval('public.articles_author_id_seq'::regclass);


--
-- TOC entry 2728 (class 2604 OID 16947)
-- Name: articles_category id; Type: DEFAULT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles_category ALTER COLUMN id SET DEFAULT nextval('public.articles_category_id_seq'::regclass);


--
-- TOC entry 2729 (class 2604 OID 16948)
-- Name: articles_category article_id; Type: DEFAULT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles_category ALTER COLUMN article_id SET DEFAULT nextval('public.articles_category_article_id_seq'::regclass);


--
-- TOC entry 2730 (class 2604 OID 16949)
-- Name: articles_category category_id; Type: DEFAULT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles_category ALTER COLUMN category_id SET DEFAULT nextval('public.articles_category_category_id_seq'::regclass);


--
-- TOC entry 2723 (class 2604 OID 16907)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 2731 (class 2604 OID 16971)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- TOC entry 2732 (class 2604 OID 16972)
-- Name: comments article_id; Type: DEFAULT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.comments ALTER COLUMN article_id SET DEFAULT nextval('public.comments_article_id_seq'::regclass);


--
-- TOC entry 2733 (class 2604 OID 16973)
-- Name: comments author_id; Type: DEFAULT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.comments ALTER COLUMN author_id SET DEFAULT nextval('public.comments_author_id_seq'::regclass);


--
-- TOC entry 2724 (class 2604 OID 16915)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2883 (class 0 OID 16922)
-- Dependencies: 208
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: academy
--

COPY public.articles (id, author_id, title, img, announce, full_text, date_create) FROM stdin;
\.


--
-- TOC entry 2887 (class 0 OID 16944)
-- Dependencies: 212
-- Data for Name: articles_category; Type: TABLE DATA; Schema: public; Owner: academy
--

COPY public.articles_category (id, article_id, category_id) FROM stdin;
\.


--
-- TOC entry 2878 (class 0 OID 16904)
-- Dependencies: 203
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: academy
--

COPY public.categories (id, title) FROM stdin;
\.


--
-- TOC entry 2891 (class 0 OID 16968)
-- Dependencies: 216
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: academy
--

COPY public.comments (id, article_id, author_id, text, date_create) FROM stdin;
\.


--
-- TOC entry 2880 (class 0 OID 16912)
-- Dependencies: 205
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: academy
--

COPY public.users (id, name, surname, email, password) FROM stdin;
\.


--
-- TOC entry 2907 (class 0 OID 0)
-- Dependencies: 207
-- Name: articles_author_id_seq; Type: SEQUENCE SET; Schema: public; Owner: academy
--

SELECT pg_catalog.setval('public.articles_author_id_seq', 1, false);


--
-- TOC entry 2908 (class 0 OID 0)
-- Dependencies: 210
-- Name: articles_category_article_id_seq; Type: SEQUENCE SET; Schema: public; Owner: academy
--

SELECT pg_catalog.setval('public.articles_category_article_id_seq', 1, false);


--
-- TOC entry 2909 (class 0 OID 0)
-- Dependencies: 211
-- Name: articles_category_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: academy
--

SELECT pg_catalog.setval('public.articles_category_category_id_seq', 1, false);


--
-- TOC entry 2910 (class 0 OID 0)
-- Dependencies: 209
-- Name: articles_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: academy
--

SELECT pg_catalog.setval('public.articles_category_id_seq', 1, false);


--
-- TOC entry 2911 (class 0 OID 0)
-- Dependencies: 206
-- Name: articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: academy
--

SELECT pg_catalog.setval('public.articles_id_seq', 1, false);


--
-- TOC entry 2912 (class 0 OID 0)
-- Dependencies: 202
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: academy
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- TOC entry 2913 (class 0 OID 0)
-- Dependencies: 214
-- Name: comments_article_id_seq; Type: SEQUENCE SET; Schema: public; Owner: academy
--

SELECT pg_catalog.setval('public.comments_article_id_seq', 1, false);


--
-- TOC entry 2914 (class 0 OID 0)
-- Dependencies: 215
-- Name: comments_author_id_seq; Type: SEQUENCE SET; Schema: public; Owner: academy
--

SELECT pg_catalog.setval('public.comments_author_id_seq', 1, false);


--
-- TOC entry 2915 (class 0 OID 0)
-- Dependencies: 213
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: academy
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- TOC entry 2916 (class 0 OID 0)
-- Dependencies: 204
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: academy
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 2743 (class 2606 OID 16951)
-- Name: articles_category articles_category_pkey; Type: CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles_category
    ADD CONSTRAINT articles_category_pkey PRIMARY KEY (id);


--
-- TOC entry 2740 (class 2606 OID 16932)
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- TOC entry 2736 (class 2606 OID 16909)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 2745 (class 2606 OID 16979)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 2738 (class 2606 OID 16917)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2741 (class 1259 OID 16990)
-- Name: index_title_article; Type: INDEX; Schema: public; Owner: academy
--

CREATE INDEX index_title_article ON public.articles USING btree (title);


--
-- TOC entry 2746 (class 2606 OID 16933)
-- Name: articles articles_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2747 (class 2606 OID 16952)
-- Name: articles_category articles_category_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles_category
    ADD CONSTRAINT articles_category_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2748 (class 2606 OID 16957)
-- Name: articles_category articles_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles_category
    ADD CONSTRAINT articles_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2749 (class 2606 OID 16980)
-- Name: comments comments_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2750 (class 2606 OID 16985)
-- Name: comments comments_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2020-04-28 12:15:46

--
-- PostgreSQL database dump complete
--

