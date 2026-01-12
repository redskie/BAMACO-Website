#!/usr/bin/env python3
"""
BAMACO Content Manager
A GUI application for managing players, guilds, and articles on the BAMACO website.

Features:
- Create, edit, and update player profiles
- Manage guild information and members
- Create and edit articles
- User-friendly tabbed interface
- Automatic data.json generation
- File validation and error handling
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import os
import re
import json
import subprocess
from datetime import datetime
from pathlib import Path

class BAMACOContentManager:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("BAMACO Content Manager v1.0")
        self.root.geometry("1000x700")
        self.root.configure(bg="#ffe6f0")
        
        # Set the icon and styling
        self.setup_styling()
        
        # Initialize variables
        self.current_player = {}
        self.current_guild = {}
        self.current_article = {}
        
        # Create main interface
        self.create_interface()
        
        # Load existing data
        self.refresh_all_lists()
    
    def setup_styling(self):
        """Setup custom styling for the GUI"""
        style = ttk.Style()
        style.theme_use('clam')
        
        # Configure colors to match BAMACO theme
        style.configure('TNotebook', background='#ffe6f0', borderwidth=0)
        style.configure('TNotebook.Tab', padding=[12, 8], background='#ffcfe3')
        style.configure('TFrame', background='#ffe6f0')
        style.configure('TLabel', background='#ffe6f0', foreground='#2d1b2e')
        style.configure('TButton', padding=[10, 5])
        style.configure('Heading.TLabel', font=('Inter', 12, 'bold'), background='#ffe6f0', foreground='#2d1b2e')
    
    def create_interface(self):
        """Create the main GUI interface"""
        # Create main frame
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Title
        title_label = ttk.Label(main_frame, text="BAMACO Content Manager", 
                               font=('Inter', 20, 'bold'), style='Heading.TLabel')
        title_label.pack(pady=(0, 20))
        
        # Create notebook for tabs
        self.notebook = ttk.Notebook(main_frame)
        self.notebook.pack(fill=tk.BOTH, expand=True)
        
        # Create tabs
        self.create_players_tab()
        self.create_guilds_tab()
        self.create_articles_tab()
        self.create_tools_tab()
    
    def create_players_tab(self):
        """Create the players management tab"""
        players_frame = ttk.Frame(self.notebook)
        self.notebook.add(players_frame, text="👤 Players")
        
        # Create paned window for list and form
        paned = ttk.PanedWindow(players_frame, orient=tk.HORIZONTAL)
        paned.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Left panel - Players list
        left_frame = ttk.Frame(paned)
        paned.add(left_frame, weight=1)
        
        ttk.Label(left_frame, text="Existing Players", style='Heading.TLabel').pack(pady=(0, 10))
        
        # Players listbox with scrollbar
        list_frame = ttk.Frame(left_frame)
        list_frame.pack(fill=tk.BOTH, expand=True)
        
        self.players_listbox = tk.Listbox(list_frame, bg='white', fg='#2d1b2e', 
                                         selectbackground='#ff6b9d', font=('Inter', 10))
        scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.players_listbox.yview)
        self.players_listbox.configure(yscrollcommand=scrollbar.set)
        
        self.players_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Bind selection event
        self.players_listbox.bind('<<ListboxSelect>>', self.on_player_select)
        
        # Buttons frame
        btn_frame = ttk.Frame(left_frame)
        btn_frame.pack(fill=tk.X, pady=(10, 0))
        
        ttk.Button(btn_frame, text="New Player", command=self.new_player).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(btn_frame, text="Delete Player", command=self.delete_player).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="Refresh", command=self.refresh_players_list).pack(side=tk.RIGHT)
        
        # Right panel - Player form
        right_frame = ttk.Frame(paned)
        paned.add(right_frame, weight=2)
        
        self.create_player_form(right_frame)
    
    def create_player_form(self, parent):
        """Create the player editing form"""
        # Create scrollable frame
        canvas = tk.Canvas(parent, bg='#ffe6f0')
        scrollbar = ttk.Scrollbar(parent, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        # Form title
        ttk.Label(scrollable_frame, text="Player Information", style='Heading.TLabel').pack(pady=(0, 20))
        
        # Create form fields
        self.player_fields = {}
        
        # Basic Information
        basic_frame = ttk.LabelFrame(scrollable_frame, text="Basic Information", padding=15)
        basic_frame.pack(fill=tk.X, pady=(0, 15))
        
        # Name
        ttk.Label(basic_frame, text="Full Name*:").pack(anchor=tk.W)
        self.player_fields['name'] = ttk.Entry(basic_frame, width=50, font=('Inter', 10))
        self.player_fields['name'].pack(fill=tk.X, pady=(0, 10))
        
        # IGN
        ttk.Label(basic_frame, text="In-Game Name (IGN)*:").pack(anchor=tk.W)
        self.player_fields['ign'] = ttk.Entry(basic_frame, width=50, font=('Inter', 10))
        self.player_fields['ign'].pack(fill=tk.X, pady=(0, 10))
        
        # Nickname
        ttk.Label(basic_frame, text="Nickname:").pack(anchor=tk.W)
        self.player_fields['nickname'] = ttk.Entry(basic_frame, width=50, font=('Inter', 10))
        self.player_fields['nickname'].pack(fill=tk.X, pady=(0, 10))
        
        # Title
        ttk.Label(basic_frame, text="Title/Role:").pack(anchor=tk.W)
        self.player_fields['title'] = ttk.Entry(basic_frame, width=50, font=('Inter', 10))
        self.player_fields['title'].pack(fill=tk.X, pady=(0, 10))
        
        # Avatar Image
        ttk.Label(basic_frame, text="Avatar Image URL:").pack(anchor=tk.W)
        avatar_frame = ttk.Frame(basic_frame)
        avatar_frame.pack(fill=tk.X, pady=(0, 10))
        self.player_fields['avatarImage'] = ttk.Entry(avatar_frame, font=('Inter', 10))
        self.player_fields['avatarImage'].pack(side=tk.LEFT, fill=tk.X, expand=True)
        ttk.Button(avatar_frame, text="Browse", command=lambda: self.browse_file(self.player_fields['avatarImage'])).pack(side=tk.RIGHT, padx=(5, 0))
        
        # Game Information
        game_frame = ttk.LabelFrame(scrollable_frame, text="MaiMai Information", padding=15)
        game_frame.pack(fill=tk.X, pady=(0, 15))
        
        # Friend Code
        ttk.Label(game_frame, text="MaiMai Friend Code:").pack(anchor=tk.W)
        self.player_fields['maimaiFriendCode'] = ttk.Entry(game_frame, width=50, font=('Inter', 10))
        self.player_fields['maimaiFriendCode'].pack(fill=tk.X, pady=(0, 10))
        
        # Rating
        ttk.Label(game_frame, text="Rating:").pack(anchor=tk.W)
        self.player_fields['rating'] = ttk.Entry(game_frame, width=50, font=('Inter', 10))
        self.player_fields['rating'].pack(fill=tk.X, pady=(0, 10))
        
        # Rank
        ttk.Label(game_frame, text="Rank:").pack(anchor=tk.W)
        self.player_fields['rank'] = ttk.Entry(game_frame, width=50, font=('Inter', 10))
        self.player_fields['rank'].pack(fill=tk.X, pady=(0, 10))
        
        # Personal Information
        personal_frame = ttk.LabelFrame(scrollable_frame, text="Personal Information", padding=15)
        personal_frame.pack(fill=tk.X, pady=(0, 15))
        
        # Age
        ttk.Label(personal_frame, text="Age:").pack(anchor=tk.W)
        self.player_fields['age'] = ttk.Entry(personal_frame, width=50, font=('Inter', 10))
        self.player_fields['age'].pack(fill=tk.X, pady=(0, 10))
        
        # Motto
        ttk.Label(personal_frame, text="Motto:").pack(anchor=tk.W)
        self.player_fields['motto'] = ttk.Entry(personal_frame, width=50, font=('Inter', 10))
        self.player_fields['motto'].pack(fill=tk.X, pady=(0, 10))
        
        # Joined
        ttk.Label(personal_frame, text="Year Joined:").pack(anchor=tk.W)
        self.player_fields['joined'] = ttk.Entry(personal_frame, width=50, font=('Inter', 10))
        self.player_fields['joined'].pack(fill=tk.X, pady=(0, 10))
        
        # Bio
        ttk.Label(personal_frame, text="Biography:").pack(anchor=tk.W)
        bio_frame = ttk.Frame(personal_frame)
        bio_frame.pack(fill=tk.X, pady=(0, 10))
        self.player_fields['bio'] = tk.Text(bio_frame, height=4, width=50, font=('Inter', 10), wrap=tk.WORD)
        bio_scroll = ttk.Scrollbar(bio_frame, orient=tk.VERTICAL, command=self.player_fields['bio'].yview)
        self.player_fields['bio'].configure(yscrollcommand=bio_scroll.set)
        self.player_fields['bio'].pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        bio_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Guild Information
        guild_frame = ttk.LabelFrame(scrollable_frame, text="Guild Information", padding=15)
        guild_frame.pack(fill=tk.X, pady=(0, 15))
        
        ttk.Label(guild_frame, text="Guild ID (leave empty if no guild):").pack(anchor=tk.W)
        self.player_fields['guildId'] = ttk.Combobox(guild_frame, width=47, font=('Inter', 10))
        self.player_fields['guildId'].pack(fill=tk.X, pady=(0, 10))
        self.refresh_guild_combobox()
        
        # Save button
        save_frame = ttk.Frame(scrollable_frame)
        save_frame.pack(fill=tk.X, pady=(20, 0))
        
        ttk.Button(save_frame, text="Save Player", command=self.save_player, 
                  style='Accent.TButton').pack(side=tk.RIGHT, padx=(5, 0))
        ttk.Button(save_frame, text="Clear Form", command=self.clear_player_form).pack(side=tk.RIGHT)
        
        # Pack canvas and scrollbar
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
    def create_article_form(self, parent):
        """Create the article editing form"""
        # Create scrollable frame
        canvas = tk.Canvas(parent, bg='#ffe6f0')
        scrollbar = ttk.Scrollbar(parent, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        # Form title
        ttk.Label(scrollable_frame, text="Article Information", style='Heading.TLabel').pack(pady=(0, 20))
        
        self.article_fields = {}
        
        # Basic Information
        basic_frame = ttk.LabelFrame(scrollable_frame, text="Basic Information", padding=15)
        basic_frame.pack(fill=tk.X, pady=(0, 15))
        
        # Article ID
        ttk.Label(basic_frame, text="Article ID* (unique identifier, e.g., A001):").pack(anchor=tk.W)
        self.article_fields['id'] = ttk.Entry(basic_frame, width=50, font=('Inter', 10))
        self.article_fields['id'].pack(fill=tk.X, pady=(0, 10))
        
        # Title
        ttk.Label(basic_frame, text="Article Title*:").pack(anchor=tk.W)
        self.article_fields['title'] = ttk.Entry(basic_frame, width=50, font=('Inter', 10))
        self.article_fields['title'].pack(fill=tk.X, pady=(0, 10))
        
        # Author
        ttk.Label(basic_frame, text="Author*:").pack(anchor=tk.W)
        self.article_fields['author'] = ttk.Entry(basic_frame, width=50, font=('Inter', 10))
        self.article_fields['author'].pack(fill=tk.X, pady=(0, 10))
        
        # Category
        ttk.Label(basic_frame, text="Category:").pack(anchor=tk.W)
        self.article_fields['category'] = ttk.Combobox(basic_frame, width=47, font=('Inter', 10))
        self.article_fields['category']['values'] = ['Guide', 'Tutorial', 'News', 'Review', 'Tips', 'Analysis', 'Other']
        self.article_fields['category'].pack(fill=tk.X, pady=(0, 10))
        
        # Publication Date
        ttk.Label(basic_frame, text="Publication Date (YYYY-MM-DD):").pack(anchor=tk.W)
        date_frame = ttk.Frame(basic_frame)
        date_frame.pack(fill=tk.X, pady=(0, 10))
        self.article_fields['date'] = ttk.Entry(date_frame, font=('Inter', 10))
        self.article_fields['date'].pack(side=tk.LEFT, fill=tk.X, expand=True)
        ttk.Button(date_frame, text="Today", command=self.set_today_date).pack(side=tk.RIGHT, padx=(5, 0))
        
        # Excerpt
        ttk.Label(basic_frame, text="Excerpt (short summary):").pack(anchor=tk.W)
        excerpt_frame = ttk.Frame(basic_frame)
        excerpt_frame.pack(fill=tk.X, pady=(0, 10))
        self.article_fields['excerpt'] = tk.Text(excerpt_frame, height=3, width=50, font=('Inter', 10), wrap=tk.WORD)
        excerpt_scroll = ttk.Scrollbar(excerpt_frame, orient=tk.VERTICAL, command=self.article_fields['excerpt'].yview)
        self.article_fields['excerpt'].configure(yscrollcommand=excerpt_scroll.set)
        self.article_fields['excerpt'].pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        excerpt_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Content
        content_frame = ttk.LabelFrame(scrollable_frame, text="Article Content", padding=15)
        content_frame.pack(fill=tk.X, pady=(0, 15))
        
        ttk.Label(content_frame, text="Article Content (HTML):").pack(anchor=tk.W)
        content_text_frame = ttk.Frame(content_frame)
        content_text_frame.pack(fill=tk.X, pady=(0, 10))
        self.article_fields['content'] = tk.Text(content_text_frame, height=15, width=50, font=('Consolas', 9), wrap=tk.WORD)
        content_scroll = ttk.Scrollbar(content_text_frame, orient=tk.VERTICAL, command=self.article_fields['content'].yview)
        self.article_fields['content'].configure(yscrollcommand=content_scroll.set)
        self.article_fields['content'].pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        content_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Tags
        meta_frame = ttk.LabelFrame(scrollable_frame, text="Metadata", padding=15)
        meta_frame.pack(fill=tk.X, pady=(0, 15))
        
        ttk.Label(meta_frame, text="Tags (comma-separated):").pack(anchor=tk.W)
        self.article_fields['tags'] = ttk.Entry(meta_frame, width=50, font=('Inter', 10))
        self.article_fields['tags'].pack(fill=tk.X, pady=(0, 10))
        
        # Reading Time (auto-calculated)
        ttk.Label(meta_frame, text="Estimated Reading Time (minutes):").pack(anchor=tk.W)
        reading_frame = ttk.Frame(meta_frame)
        reading_frame.pack(fill=tk.X, pady=(0, 10))
        self.article_fields['readingTime'] = ttk.Entry(reading_frame, font=('Inter', 10))
        self.article_fields['readingTime'].pack(side=tk.LEFT, fill=tk.X, expand=True)
        ttk.Button(reading_frame, text="Calculate", command=self.calculate_reading_time).pack(side=tk.RIGHT, padx=(5, 0))
        
        # Featured Image
        ttk.Label(meta_frame, text="Featured Image URL:").pack(anchor=tk.W)
        image_frame = ttk.Frame(meta_frame)
        image_frame.pack(fill=tk.X, pady=(0, 10))
        self.article_fields['featuredImage'] = ttk.Entry(image_frame, font=('Inter', 10))
        self.article_fields['featuredImage'].pack(side=tk.LEFT, fill=tk.X, expand=True)
        ttk.Button(image_frame, text="Browse", command=lambda: self.browse_file(self.article_fields['featuredImage'])).pack(side=tk.RIGHT, padx=(5, 0))
        
        # Save button
        save_frame = ttk.Frame(scrollable_frame)
        save_frame.pack(fill=tk.X, pady=(20, 0))
        
        ttk.Button(save_frame, text="Save Article", command=self.save_article, 
                  style='Accent.TButton').pack(side=tk.RIGHT, padx=(5, 0))
        ttk.Button(save_frame, text="Clear Form", command=self.clear_article_form).pack(side=tk.RIGHT)
        
        # Pack canvas
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # Bind mousewheel
        def _on_mousewheel(event):
            canvas.yview_scroll(int(-1*(event.delta/120)), "units")
        canvas.bind("<MouseWheel>", _on_mousewheel)
    
    def create_guilds_tab(self):
        """Create the guilds management tab"""
        guilds_frame = ttk.Frame(self.notebook)
        self.notebook.add(guilds_frame, text="🛡️ Guilds")
        
        # Create paned window
        paned = ttk.PanedWindow(guilds_frame, orient=tk.HORIZONTAL)
        paned.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Left panel - Guilds list
        left_frame = ttk.Frame(paned)
        paned.add(left_frame, weight=1)
        
        ttk.Label(left_frame, text="Existing Guilds", style='Heading.TLabel').pack(pady=(0, 10))
        
        # Guilds listbox
        list_frame = ttk.Frame(left_frame)
        list_frame.pack(fill=tk.BOTH, expand=True)
        
        self.guilds_listbox = tk.Listbox(list_frame, bg='white', fg='#2d1b2e', 
                                        selectbackground='#ff6b9d', font=('Inter', 10))
        scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.guilds_listbox.yview)
        self.guilds_listbox.configure(yscrollcommand=scrollbar.set)
        
        self.guilds_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.guilds_listbox.bind('<<ListboxSelect>>', self.on_guild_select)
        
        # Buttons
        btn_frame = ttk.Frame(left_frame)
        btn_frame.pack(fill=tk.X, pady=(10, 0))
        
        ttk.Button(btn_frame, text="New Guild", command=self.new_guild).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(btn_frame, text="Delete Guild", command=self.delete_guild).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="Refresh", command=self.refresh_guilds_list).pack(side=tk.RIGHT)
        
        # Right panel - Guild form
        right_frame = ttk.Frame(paned)
        paned.add(right_frame, weight=2)
        
        self.create_guild_form(right_frame)
    
    def create_guild_form(self, parent):
        """Create the guild editing form"""
        # Create scrollable frame
        canvas = tk.Canvas(parent, bg='#ffe6f0')
        scrollbar = ttk.Scrollbar(parent, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        # Form title
        ttk.Label(scrollable_frame, text="Guild Information", style='Heading.TLabel').pack(pady=(0, 20))
        
        self.guild_fields = {}
        
        # Basic Information
        basic_frame = ttk.LabelFrame(scrollable_frame, text="Basic Information", padding=15)
        basic_frame.pack(fill=tk.X, pady=(0, 15))
        
        # Guild ID
        ttk.Label(basic_frame, text="Guild ID* (unique identifier):").pack(anchor=tk.W)
        self.guild_fields['id'] = ttk.Entry(basic_frame, width=50, font=('Inter', 10))
        self.guild_fields['id'].pack(fill=tk.X, pady=(0, 10))
        
        # Name
        ttk.Label(basic_frame, text="Guild Name*:").pack(anchor=tk.W)
        self.guild_fields['name'] = ttk.Entry(basic_frame, width=50, font=('Inter', 10))
        self.guild_fields['name'].pack(fill=tk.X, pady=(0, 10))
        
        # Motto
        ttk.Label(basic_frame, text="Guild Motto:").pack(anchor=tk.W)
        self.guild_fields['motto'] = ttk.Entry(basic_frame, width=50, font=('Inter', 10))
        self.guild_fields['motto'].pack(fill=tk.X, pady=(0, 10))
        
        # Level
        ttk.Label(basic_frame, text="Guild Level:").pack(anchor=tk.W)
        self.guild_fields['level'] = ttk.Entry(basic_frame, width=50, font=('Inter', 10))
        self.guild_fields['level'].pack(fill=tk.X, pady=(0, 10))
        
        # Established
        ttk.Label(basic_frame, text="Year Established:").pack(anchor=tk.W)
        self.guild_fields['established'] = ttk.Entry(basic_frame, width=50, font=('Inter', 10))
        self.guild_fields['established'].pack(fill=tk.X, pady=(0, 10))
        
        # Logo
        ttk.Label(basic_frame, text="Guild Logo URL:").pack(anchor=tk.W)
        logo_frame = ttk.Frame(basic_frame)
        logo_frame.pack(fill=tk.X, pady=(0, 10))
        self.guild_fields['guildLogo'] = ttk.Entry(logo_frame, font=('Inter', 10))
        self.guild_fields['guildLogo'].pack(side=tk.LEFT, fill=tk.X, expand=True)
        ttk.Button(logo_frame, text="Browse", command=lambda: self.browse_file(self.guild_fields['guildLogo'])).pack(side=tk.RIGHT, padx=(5, 0))
        
        # Description
        desc_frame = ttk.LabelFrame(scrollable_frame, text="Description", padding=15)
        desc_frame.pack(fill=tk.X, pady=(0, 15))
        
        ttk.Label(desc_frame, text="Guild Description:").pack(anchor=tk.W)
        desc_text_frame = ttk.Frame(desc_frame)
        desc_text_frame.pack(fill=tk.X, pady=(0, 10))
        self.guild_fields['description'] = tk.Text(desc_text_frame, height=6, width=50, font=('Inter', 10), wrap=tk.WORD)
        desc_scroll = ttk.Scrollbar(desc_text_frame, orient=tk.VERTICAL, command=self.guild_fields['description'].yview)
        self.guild_fields['description'].configure(yscrollcommand=desc_scroll.set)
        self.guild_fields['description'].pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        desc_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Save button
        save_frame = ttk.Frame(scrollable_frame)
        save_frame.pack(fill=tk.X, pady=(20, 0))
        
        ttk.Button(save_frame, text="Save Guild", command=self.save_guild, 
                  style='Accent.TButton').pack(side=tk.RIGHT, padx=(5, 0))
        ttk.Button(save_frame, text="Clear Form", command=self.clear_guild_form).pack(side=tk.RIGHT)
        
        # Pack canvas
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # Bind mousewheel
        def _on_mousewheel(event):
            canvas.yview_scroll(int(-1*(event.delta/120)), "units")
        canvas.bind("<MouseWheel>", _on_mousewheel)
    
    def create_articles_tab(self):
        """Create the articles management tab"""
        articles_frame = ttk.Frame(self.notebook)
        self.notebook.add(articles_frame, text="📚 Articles")
        
        # Create paned window
        paned = ttk.PanedWindow(articles_frame, orient=tk.HORIZONTAL)
        paned.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Left panel - Articles list
        left_frame = ttk.Frame(paned)
        paned.add(left_frame, weight=1)
        
        ttk.Label(left_frame, text="Existing Articles", style='Heading.TLabel').pack(pady=(0, 10))
        
        # Articles listbox
        list_frame = ttk.Frame(left_frame)
        list_frame.pack(fill=tk.BOTH, expand=True)
        
        self.articles_listbox = tk.Listbox(list_frame, bg='white', fg='#2d1b2e', 
                                          selectbackground='#ff6b9d', font=('Inter', 10))
        scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.articles_listbox.yview)
        self.articles_listbox.configure(yscrollcommand=scrollbar.set)
        
        self.articles_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.articles_listbox.bind('<<ListboxSelect>>', self.on_article_select)
        
        # Buttons
        btn_frame = ttk.Frame(left_frame)
        btn_frame.pack(fill=tk.X, pady=(10, 0))
        
        ttk.Button(btn_frame, text="New Article", command=self.new_article).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(btn_frame, text="Delete Article", command=self.delete_article).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="Refresh", command=self.refresh_articles_list).pack(side=tk.RIGHT)
        
        # Right panel - Article form
        right_frame = ttk.Frame(paned)
        paned.add(right_frame, weight=2)
        
        self.create_article_form(right_frame)
    
    def create_tools_tab(self):
        """Create the tools and utilities tab"""
        tools_frame = ttk.Frame(self.notebook)
        self.notebook.add(tools_frame, text="🔧 Tools")
        
        ttk.Label(tools_frame, text="Tools & Utilities", style='Heading.TLabel').pack(pady=(20, 30))
        
        # Data generation
        data_frame = ttk.LabelFrame(tools_frame, text="Data Management", padding=20)
        data_frame.pack(fill=tk.X, padx=20, pady=(0, 20))
        
        ttk.Label(data_frame, text="Generate data.json from all HTML files:").pack(anchor=tk.W, pady=(0, 10))
        ttk.Button(data_frame, text="Generate Data File", command=self.generate_data_file).pack(anchor=tk.W)
        
        # File operations
        file_frame = ttk.LabelFrame(tools_frame, text="File Operations", padding=20)
        file_frame.pack(fill=tk.X, padx=20, pady=(0, 20))
        
        ttk.Label(file_frame, text="Backup and restore operations:").pack(anchor=tk.W, pady=(0, 10))
        btn_frame = ttk.Frame(file_frame)
        btn_frame.pack(anchor=tk.W)
        ttk.Button(btn_frame, text="Backup All Files", command=self.backup_files).pack(side=tk.LEFT, padx=(0, 10))
        ttk.Button(btn_frame, text="Open Project Folder", command=self.open_project_folder).pack(side=tk.LEFT)
    
    def browse_file(self, entry_widget):
        """Open file browser for image selection"""
        filename = filedialog.askopenfilename(
            title="Select Image",
            filetypes=[("Image files", "*.png *.jpg *.jpeg *.gif *.bmp"), ("All files", "*.*")]
        )
        if filename:
            entry_widget.delete(0, tk.END)
            entry_widget.insert(0, filename)
    
    def refresh_all_lists(self):
        """Refresh all data lists"""
        self.refresh_players_list()
        self.refresh_guilds_list()
        self.refresh_articles_list()
        self.refresh_guild_combobox()
    
    def refresh_players_list(self):
        """Refresh the players list"""
        self.players_listbox.delete(0, tk.END)
        players_dir = Path("players")
        if players_dir.exists():
            for file in players_dir.glob("*.html"):
                if file.name != "playerprofiletemplate.html":
                    player_data = self.parse_player_file(file)
                    if player_data:
                        display_name = f"{player_data.get('name', 'Unknown')} ({player_data.get('ign', 'No IGN')})"
                        self.players_listbox.insert(tk.END, display_name)
    
    def refresh_guilds_list(self):
        """Refresh the guilds list"""
        self.guilds_listbox.delete(0, tk.END)
        guilds_dir = Path("guilds")
        if guilds_dir.exists():
            for file in guilds_dir.glob("*.html"):
                if file.name != "guildtemplate.html":
                    guild_data = self.parse_guild_file(file)
                    if guild_data:
                        display_name = f"{guild_data.get('name', 'Unknown')} (ID: {guild_data.get('id', 'No ID')})"
                        self.guilds_listbox.insert(tk.END, display_name)
    
    def refresh_guild_combobox(self):
        """Refresh the guild combobox in player form"""
        if hasattr(self, 'player_fields') and 'guildId' in self.player_fields:
            guilds = [""]  # Empty option for no guild
            guilds_dir = Path("guilds")
            if guilds_dir.exists():
                for file in guilds_dir.glob("*.html"):
                    if file.name != "guildtemplate.html":
                        guild_data = self.parse_guild_file(file)
                        if guild_data and guild_data.get('id'):
                            guilds.append(guild_data['id'])
            
            self.player_fields['guildId']['values'] = guilds
    
    def parse_player_file(self, file_path):
        """Parse player HTML file and extract PLAYER_INFO"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract PLAYER_INFO object
            match = re.search(r'const PLAYER_INFO\s*=\s*{(.*?)};', content, re.DOTALL)
            if match:
                js_object = match.group(1)
                return self.parse_js_object(js_object)
            return None
        except Exception as e:
            print(f"Error parsing player file {file_path}: {e}")
            return None
    
    def parse_guild_file(self, file_path):
        """Parse guild HTML file and extract GUILD_INFO"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract GUILD_INFO object
            match = re.search(r'const GUILD_INFO\s*=\s*{(.*?)};', content, re.DOTALL)
            if match:
                js_object = match.group(1)
                return self.parse_js_object(js_object)
            return None
        except Exception as e:
            print(f"Error parsing guild file {file_path}: {e}")
            return None
    
    def refresh_articles_list(self):
        """Refresh the articles list"""
        self.articles_listbox.delete(0, tk.END)
        articles_dir = Path("articles")
        if articles_dir.exists():
            for file in articles_dir.glob("*.html"):
                if file.name != "articletemplate.html":
                    article_data = self.parse_article_file(file)
                    if article_data:
                        display_name = f"{article_data.get('title', 'Unknown')} (ID: {article_data.get('id', 'No ID')})"
                        self.articles_listbox.insert(tk.END, display_name)
    
    def parse_article_file(self, file_path):
        """Parse article HTML file and extract ARTICLE_INFO"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract ARTICLE_INFO object
            match = re.search(r'const ARTICLE_INFO\s*=\s*{(.*?)};', content, re.DOTALL)
            if match:
                js_object = match.group(1)
                return self.parse_js_object(js_object)
            return None
        except Exception as e:
            print(f"Error parsing article file {file_path}: {e}")
            return None
    
    def on_article_select(self, event):
        """Handle article selection from list"""
        selection = self.articles_listbox.curselection()
        if selection:
            index = selection[0]
            articles_dir = Path("articles")
            files = [f for f in articles_dir.glob("*.html") if f.name != "articletemplate.html"]
            
            if index < len(files):
                file_path = files[index]
                article_data = self.parse_article_file(file_path)
                if article_data:
                    self.load_article_data(article_data)
                    self.current_article = {'file_path': file_path, 'data': article_data}
    
    def load_article_data(self, data):
        """Load article data into form fields"""
        for key, widget in self.article_fields.items():
            if key in data:
                if isinstance(widget, tk.Text):
                    widget.delete(1.0, tk.END)
                    widget.insert(1.0, str(data[key]))
                else:
                    widget.delete(0, tk.END)
                    widget.insert(0, str(data[key]))
    
    def new_article(self):
        """Create a new article"""
        self.clear_article_form()
        self.current_article = {}
        # Set today's date by default
        self.set_today_date()
    
    def clear_article_form(self):
        """Clear all article form fields"""
        for widget in self.article_fields.values():
            if isinstance(widget, tk.Text):
                widget.delete(1.0, tk.END)
            else:
                widget.delete(0, tk.END)
    
    def set_today_date(self):
        """Set today's date in the date field"""
        if hasattr(self, 'article_fields') and 'date' in self.article_fields:
            today = datetime.now().strftime("%Y-%m-%d")
            self.article_fields['date'].delete(0, tk.END)
            self.article_fields['date'].insert(0, today)
    
    def calculate_reading_time(self):
        """Calculate estimated reading time based on content"""
        if hasattr(self, 'article_fields') and 'content' in self.article_fields:
            content = self.article_fields['content'].get(1.0, tk.END)
            # Average reading speed: 200 words per minute
            word_count = len(content.split())
            reading_time = max(1, round(word_count / 200))
            
            self.article_fields['readingTime'].delete(0, tk.END)
            self.article_fields['readingTime'].insert(0, str(reading_time))
    
    def save_article(self):
        """Save article data to HTML file"""
        try:
            # Get data from form
            data = {}
            for key, widget in self.article_fields.items():
                if isinstance(widget, tk.Text):
                    data[key] = widget.get(1.0, tk.END).strip()
                else:
                    data[key] = widget.get().strip()
            
            # Validate required fields
            if not data.get('id') or not data.get('title') or not data.get('author'):
                messagebox.showerror("Error", "Article ID, Title, and Author are required fields!")
                return
            
            # Generate file name
            file_name = f"{data['id']}.html"
            file_path = Path("articles") / file_name
            
            # Create HTML content
            html_content = self.generate_article_html(data)
            
            # Create articles directory if it doesn't exist
            Path("articles").mkdir(exist_ok=True)
            
            # Save file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            messagebox.showinfo("Success", f"Article saved as {file_name}")
            self.refresh_articles_list()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save article: {str(e)}")
    
    def delete_article(self):
        """Delete selected article"""
        selection = self.articles_listbox.curselection()
        if not selection:
            messagebox.showwarning("Warning", "Please select an article to delete.")
            return
        
        if messagebox.askyesno("Confirm Delete", "Are you sure you want to delete this article?"):
            index = selection[0]
            articles_dir = Path("articles")
            files = [f for f in articles_dir.glob("*.html") if f.name != "articletemplate.html"]
            
            if index < len(files):
                file_path = files[index]
                try:
                    file_path.unlink()
                    messagebox.showinfo("Success", "Article deleted successfully.")
                    self.refresh_articles_list()
                    self.clear_article_form()
                except Exception as e:
                    messagebox.showerror("Error", f"Failed to delete article: {str(e)}")
    
    def generate_article_html(self, data):
        """Generate HTML content for article file"""
        template_path = Path("articles") / "articletemplate.html"
        if template_path.exists():
            with open(template_path, 'r', encoding='utf-8') as f:
                template = f.read()
            
            # Replace template data with actual data
            js_object = self.generate_article_js_object(data)
            
            # Replace the ARTICLE_INFO object in template
            pattern = r'const ARTICLE_INFO\s*=\s*{.*?};'
            replacement = f"const ARTICLE_INFO = {js_object};"
            
            return re.sub(pattern, replacement, template, flags=re.DOTALL)
        else:
            return self.generate_basic_article_html(data)
    
    def generate_article_js_object(self, data):
        """Generate JavaScript object string for article data"""
        # Convert tags to array format
        tags_list = [tag.strip() for tag in data.get('tags', '').split(',') if tag.strip()]
        tags_str = '[' + ', '.join([f"'{tag}'" for tag in tags_list]) + ']'
        
        js_lines = [
            "{",
            f"        id: '{data.get('id', '')}',",
            f"        title: '{data.get('title', '')}',",
            f"        author: '{data.get('author', '')}',",
            f"        date: '{data.get('date', '')}',",
            f"        category: '{data.get('category', 'Guide')}',",
            f"        excerpt: `{data.get('excerpt', '')}`,",
            f"        content: `{data.get('content', '')}`,",
            f"        tags: {tags_str},",
            f"        readingTime: {data.get('readingTime', '5')},",
            f"        featuredImage: '{data.get('featuredImage', '')}',",
            "      }"
        ]
        return "\n".join(js_lines)
    
    def generate_basic_article_html(self, data):
        """Generate basic article HTML if template is missing"""
        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{data.get('title', 'Article')} - BAMACO</title>
    <!-- Add necessary CSS and JS includes -->
</head>
<body>
    <h1>{data.get('title', 'Article')}</h1>
    <p>By {data.get('author', 'Unknown')} - {data.get('date', '')}</p>
    <div>{data.get('content', '')}</div>
    <script>
    const ARTICLE_INFO = {self.generate_article_js_object(data)};
    </script>
</body>
</html>"""
        """Parse JavaScript object string to Python dict"""
        try:
            # Clean up the JavaScript object
            js_string = js_string.strip()
            
            # Extract key-value pairs
            data = {}
            lines = js_string.split('\n')
            
            for line in lines:
                line = line.strip()
                if ':' in line and not line.startswith('//'):
                    key_value = line.split(':', 1)
                    if len(key_value) == 2:
                        key = key_value[0].strip().strip("'\"")
                        value = key_value[1].strip().rstrip(',').strip("'\"")
                        
                        # Handle different value types
                        if value.startswith("'") and value.endswith("'"):
                            value = value[1:-1]
                        elif value.startswith('"') and value.endswith('"'):
                            value = value[1:-1]
                        elif value.isdigit():
                            value = int(value)
                        elif value in ['true', 'false']:
                            value = value == 'true'
                        
                        data[key] = value
            
            return data
        except Exception as e:
            print(f"Error parsing JS object: {e}")
            return {}
    
    def on_player_select(self, event):
        """Handle player selection from list"""
        selection = self.players_listbox.curselection()
        if selection:
            index = selection[0]
            players_dir = Path("players")
            files = [f for f in players_dir.glob("*.html") if f.name != "playerprofiletemplate.html"]
            
            if index < len(files):
                file_path = files[index]
                player_data = self.parse_player_file(file_path)
                if player_data:
                    self.load_player_data(player_data)
                    self.current_player = {'file_path': file_path, 'data': player_data}
    
    def on_guild_select(self, event):
        """Handle guild selection from list"""
        selection = self.guilds_listbox.curselection()
        if selection:
            index = selection[0]
            guilds_dir = Path("guilds")
            files = [f for f in guilds_dir.glob("*.html") if f.name != "guildtemplate.html"]
            
            if index < len(files):
                file_path = files[index]
                guild_data = self.parse_guild_file(file_path)
                if guild_data:
                    self.load_guild_data(guild_data)
                    self.current_guild = {'file_path': file_path, 'data': guild_data}
    
    def load_player_data(self, data):
        """Load player data into form fields"""
        for key, widget in self.player_fields.items():
            if key in data:
                if isinstance(widget, tk.Text):
                    widget.delete(1.0, tk.END)
                    widget.insert(1.0, str(data[key]))
                else:
                    widget.delete(0, tk.END)
                    widget.insert(0, str(data[key]))
    
    def load_guild_data(self, data):
        """Load guild data into form fields"""
        for key, widget in self.guild_fields.items():
            if key in data:
                if isinstance(widget, tk.Text):
                    widget.delete(1.0, tk.END)
                    widget.insert(1.0, str(data[key]))
                else:
                    widget.delete(0, tk.END)
                    widget.insert(0, str(data[key]))
    
    def new_player(self):
        """Create a new player"""
        self.clear_player_form()
        self.current_player = {}
    
    def new_guild(self):
        """Create a new guild"""
        self.clear_guild_form()
        self.current_guild = {}
    
    def clear_player_form(self):
        """Clear all player form fields"""
        for widget in self.player_fields.values():
            if isinstance(widget, tk.Text):
                widget.delete(1.0, tk.END)
            else:
                widget.delete(0, tk.END)
    
    def clear_guild_form(self):
        """Clear all guild form fields"""
        for widget in self.guild_fields.values():
            if isinstance(widget, tk.Text):
                widget.delete(1.0, tk.END)
            else:
                widget.delete(0, tk.END)
    
    def save_player(self):
        """Save player data to HTML file"""
        try:
            # Get data from form
            data = {}
            for key, widget in self.player_fields.items():
                if isinstance(widget, tk.Text):
                    data[key] = widget.get(1.0, tk.END).strip()
                else:
                    data[key] = widget.get().strip()
            
            # Validate required fields
            if not data.get('name') or not data.get('ign'):
                messagebox.showerror("Error", "Name and IGN are required fields!")
                return
            
            # Generate file name
            safe_name = re.sub(r'[^a-zA-Z0-9_]', '', data['ign'].lower().replace(' ', '_'))
            file_name = f"{safe_name}.html"
            file_path = Path("players") / file_name
            
            # Create HTML content
            html_content = self.generate_player_html(data)
            
            # Save file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            messagebox.showinfo("Success", f"Player saved as {file_name}")
            self.refresh_players_list()
            self.refresh_guild_combobox()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save player: {str(e)}")
    
    def save_guild(self):
        """Save guild data to HTML file"""
        try:
            # Get data from form
            data = {}
            for key, widget in self.guild_fields.items():
                if isinstance(widget, tk.Text):
                    data[key] = widget.get(1.0, tk.END).strip()
                else:
                    data[key] = widget.get().strip()
            
            # Validate required fields
            if not data.get('id') or not data.get('name'):
                messagebox.showerror("Error", "Guild ID and Name are required fields!")
                return
            
            # Generate file name
            file_name = f"{data['id']}.html"
            file_path = Path("guilds") / file_name
            
            # Create HTML content
            html_content = self.generate_guild_html(data)
            
            # Save file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            messagebox.showinfo("Success", f"Guild saved as {file_name}")
            self.refresh_guilds_list()
            self.refresh_guild_combobox()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save guild: {str(e)}")
    
    def generate_player_html(self, data):
        """Generate HTML content for player file"""
        template_path = Path("players") / "playerprofiletemplate.html"
        if template_path.exists():
            with open(template_path, 'r', encoding='utf-8') as f:
                template = f.read()
            
            # Replace template data with actual data
            js_object = self.generate_player_js_object(data)
            
            # Replace the PLAYER_INFO object in template
            pattern = r'const PLAYER_INFO\s*=\s*{.*?};'
            replacement = f"const PLAYER_INFO = {js_object};"
            
            return re.sub(pattern, replacement, template, flags=re.DOTALL)
        else:
            # Generate basic HTML if template doesn't exist
            return self.generate_basic_player_html(data)
    
    def generate_guild_html(self, data):
        """Generate HTML content for guild file"""
        template_path = Path("guilds") / "guildtemplate.html"
        if template_path.exists():
            with open(template_path, 'r', encoding='utf-8') as f:
                template = f.read()
            
            # Replace template data with actual data
            js_object = self.generate_guild_js_object(data)
            
            # Replace the GUILD_INFO object in template
            pattern = r'const GUILD_INFO\s*=\s*{.*?};'
            replacement = f"const GUILD_INFO = {js_object};"
            
            return re.sub(pattern, replacement, template, flags=re.DOTALL)
        else:
            return self.generate_basic_guild_html(data)
    
    def generate_player_js_object(self, data):
        """Generate JavaScript object string for player data"""
        js_lines = [
            "{\n",
            "        // Basic Information",
            f"        name: '{data.get('name', '')}', // Full player name",
            f"        ign: '{data.get('ign', '')}', // In-Game Name",
            f"        nickname: '{data.get('nickname', '')}', // Preferred nickname",
            f"        title: '{data.get('title', '')}', // Role or title",
            "",
            "        // Profile Image (optional)",
            f"        avatarImage: '{data.get('avatarImage', '')}', // URL or path to avatar image",
            "",
            "        // MaiMai Information",
            f"        maimaiFriendCode: '{data.get('maimaiFriendCode', '')}', // Friend code format",
            f"        rating: {data.get('rating', '0')}, // MaiMai rating",
            f"        rank: '{data.get('rank', 'Unranked')}', // Rank (S+, S, A+, A, etc.)",
            "",
            "        // Profile Details",
            f"        age: {data.get('age', '0')}, // Age",
            f"        motto: '{data.get('motto', '')}', // Personal motto",
            f"        joined: '{data.get('joined', '')}', // Join date",
            f"        bio: '{data.get('bio', '')}', // Short biography or description",
            "",
            "        // Guild Information",
            f"        guildId: '{data.get('guildId', '')}', // Guild ID",
            "",
            "        // Achievements (add more objects as needed)",
            "        achievements: [",
            "        ],",
            "",
            "        // Published Articles (add more objects as needed)",
            "        articles: [",
            "        ],",
            "      }"
        ]
        return "\n".join(js_lines)
    
    def generate_guild_js_object(self, data):
        """Generate JavaScript object string for guild data"""
        js_lines = [
            "{\n",
            f"        id: '{data.get('id', '')}',",
            "",
            "        // Basic Information",
            f"        name: '{data.get('name', '')}',",
            f"        motto: '{data.get('motto', '')}',",
            "",
            "        // Stats",
            f"        memberCount: '0',  // This will be auto-calculated",
            f"        level: '{data.get('level', '')}',",
            f"        established: '{data.get('established', '')}',",
            "",
            "        // Description",
            f"        description: `{data.get('description', '')}`,",
            "",
            "        // Image (Optional)",
            f"        guildLogo: '{data.get('guildLogo', '')}', // Add path to guild logo image",
            "",
            "        // Achievements (Add as many as needed)",
            "        achievements: [",
            "        ],",
            "      }"
        ]
        return "\n".join(js_lines)
    
    def generate_basic_player_html(self, data):
        """Generate basic player HTML if template is missing"""
        # This would contain a basic HTML template
        # For brevity, returning a simple structure
        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{data.get('name', 'Player')} - BAMACO</title>
    <!-- Add necessary CSS and JS includes -->
</head>
<body>
    <h1>{data.get('ign', 'Player')}</h1>
    <p>{data.get('title', '')}</p>
    <!-- Add complete player profile structure -->
    <script>
    const PLAYER_INFO = {self.generate_player_js_object(data)};
    </script>
</body>
</html>"""
    
    def generate_basic_guild_html(self, data):
        """Generate basic guild HTML if template is missing"""
        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{data.get('name', 'Guild')} - BAMACO</title>
    <!-- Add necessary CSS and JS includes -->
</head>
<body>
    <h1>{data.get('name', 'Guild')}</h1>
    <p>{data.get('motto', '')}</p>
    <!-- Add complete guild profile structure -->
    <script>
    const GUILD_INFO = {self.generate_guild_js_object(data)};
    </script>
</body>
</html>"""
    
    def delete_player(self):
        """Delete selected player"""
        selection = self.players_listbox.curselection()
        if not selection:
            messagebox.showwarning("Warning", "Please select a player to delete.")
            return
        
        if messagebox.askyesno("Confirm Delete", "Are you sure you want to delete this player?"):
            index = selection[0]
            players_dir = Path("players")
            files = [f for f in players_dir.glob("*.html") if f.name != "playerprofiletemplate.html"]
            
            if index < len(files):
                file_path = files[index]
                try:
                    file_path.unlink()
                    messagebox.showinfo("Success", "Player deleted successfully.")
                    self.refresh_players_list()
                    self.clear_player_form()
                except Exception as e:
                    messagebox.showerror("Error", f"Failed to delete player: {str(e)}")
    
    def delete_guild(self):
        """Delete selected guild"""
        selection = self.guilds_listbox.curselection()
        if not selection:
            messagebox.showwarning("Warning", "Please select a guild to delete.")
            return
        
        if messagebox.askyesno("Confirm Delete", "Are you sure you want to delete this guild?"):
            index = selection[0]
            guilds_dir = Path("guilds")
            files = [f for f in guilds_dir.glob("*.html") if f.name != "guildtemplate.html"]
            
            if index < len(files):
                file_path = files[index]
                try:
                    file_path.unlink()
                    messagebox.showinfo("Success", "Guild deleted successfully.")
                    self.refresh_guilds_list()
                    self.clear_guild_form()
                    self.refresh_guild_combobox()
                except Exception as e:
                    messagebox.showerror("Error", f"Failed to delete guild: {str(e)}")
    
    def generate_data_file(self):
        """Generate the data.json file"""
        try:
            if Path("generate_data.py").exists():
                result = subprocess.run(["python", "generate_data.py"], 
                                      capture_output=True, text=True)
                if result.returncode == 0:
                    messagebox.showinfo("Success", "Data file generated successfully!")
                else:
                    messagebox.showerror("Error", f"Failed to generate data file:\n{result.stderr}")
            else:
                messagebox.showwarning("Warning", "generate_data.py not found in project directory.")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to run data generation: {str(e)}")
    
    def backup_files(self):
        """Create a backup of all content files"""
        try:
            backup_dir = Path("backups") / datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_dir.mkdir(parents=True, exist_ok=True)
            
            # Copy players, guilds, and articles directories
            import shutil
            for folder in ["players", "guilds", "articles"]:
                if Path(folder).exists():
                    shutil.copytree(folder, backup_dir / folder)
            
            messagebox.showinfo("Success", f"Backup created in: {backup_dir}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to create backup: {str(e)}")
    
    def open_project_folder(self):
        """Open the project folder in file explorer"""
        try:
            import os
            import subprocess
            
            if os.name == 'nt':  # Windows
                os.startfile(os.getcwd())
            elif os.name == 'posix':  # macOS and Linux
                subprocess.call(('open', os.getcwd()))
        except Exception as e:
            messagebox.showerror("Error", f"Failed to open project folder: {str(e)}")
    
    def run(self):
        """Start the application"""
        self.root.mainloop()

if __name__ == "__main__":
    app = BAMACOContentManager()
    app.run()