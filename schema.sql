--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

-- Started on 2020-05-05 09:54:57

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
-- TOC entry 202 (class 1259 OID 16705)
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
-- TOC entry 203 (class 1259 OID 16712)
-- Name: articles_category; Type: TABLE; Schema: public; Owner: academy
--

CREATE TABLE public.articles_category (
    id bigint NOT NULL,
    article_id bigint NOT NULL,
    category_id bigint NOT NULL
);


ALTER TABLE public.articles_category OWNER TO academy;

--
-- TOC entry 204 (class 1259 OID 16715)
-- Name: categories; Type: TABLE; Schema: public; Owner: academy
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    title character varying(100) NOT NULL
);


ALTER TABLE public.categories OWNER TO academy;

--
-- TOC entry 205 (class 1259 OID 16718)
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
-- TOC entry 206 (class 1259 OID 16725)
-- Name: users; Type: TABLE; Schema: public; Owner: academy
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    surname character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    avatar character varying(255)
);


ALTER TABLE public.users OWNER TO academy;

--
-- TOC entry 2848 (class 0 OID 16705)
-- Dependencies: 202
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: academy
--



--
-- TOC entry 2849 (class 0 OID 16712)
-- Dependencies: 203
-- Data for Name: articles_category; Type: TABLE DATA; Schema: public; Owner: academy
--



--
-- TOC entry 2850 (class 0 OID 16715)
-- Dependencies: 204
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: academy
--



--
-- TOC entry 2851 (class 0 OID 16718)
-- Dependencies: 205
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: academy
--



--
-- TOC entry 2852 (class 0 OID 16725)
-- Dependencies: 206
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: academy
--



--
-- TOC entry 2710 (class 2606 OID 16735)
-- Name: articles_category articles_category_pkey; Type: CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles_category
    ADD CONSTRAINT articles_category_pkey PRIMARY KEY (id);


--
-- TOC entry 2708 (class 2606 OID 16737)
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- TOC entry 2712 (class 2606 OID 16733)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 2714 (class 2606 OID 16731)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 2716 (class 2606 OID 16729)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2706 (class 1259 OID 16754)
-- Name: article_title_index; Type: INDEX; Schema: public; Owner: academy
--

CREATE INDEX article_title_index ON public.articles USING btree (title);


--
-- TOC entry 2717 (class 2606 OID 16739)
-- Name: articles articles_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 2718 (class 2606 OID 16744)
-- Name: articles_category articles_category_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles_category
    ADD CONSTRAINT articles_category_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 2719 (class 2606 OID 16749)
-- Name: articles_category articles_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.articles_category
    ADD CONSTRAINT articles_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) NOT VALID;


--
-- TOC entry 2720 (class 2606 OID 16755)
-- Name: comments comments_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 2721 (class 2606 OID 16760)
-- Name: comments comments_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: academy
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


-- Completed on 2020-05-05 09:54:57

--
-- PostgreSQL database dump complete
--
