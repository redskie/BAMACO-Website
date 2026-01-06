"""
BAMACO Content Creator & Editor
A tool to create and edit player profiles, guilds, and articles with live preview
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
import json
import os
from pathlib import Path
import webbrowser
import tempfile

class BAMACOEditor:
    def __init__(self, root):
        self.root = root
        self.root.title("BAMACO Content Creator & Editor")
        self.root.geometry("1400x900")
        
        # Path to data.json
        self.data_file = Path(__file__).parent / "data.json"
        self.load_data()
        
        # Create main layout
        self.create_widgets()
        
    def load_data(self):
        """Load data from data.json"""
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
        except FileNotFoundError:
            self.data = {"players": [], "guilds": [], "articles": []}
            
    def save_data(self):
        """Save data to data.json"""
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
        messagebox.showinfo("Success", "Data saved successfully!")
        
    def create_widgets(self):
        """Create the main UI"""
        # Main container with two panes
        main_paned = ttk.PanedWindow(self.root, orient=tk.HORIZONTAL)
        main_paned.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Left side - Editor
        left_frame = ttk.Frame(main_paned)
        main_paned.add(left_frame, weight=1)
        
        # Right side - Preview
        right_frame = ttk.Frame(main_paned)
        main_paned.add(right_frame, weight=1)
        
        # Editor controls
        self.create_editor_panel(left_frame)
        
        # Preview panel
        self.create_preview_panel(right_frame)
        
    def create_editor_panel(self, parent):
        """Create the editor panel"""
        # Type selector
        type_frame = ttk.Frame(parent)
        type_frame.pack(fill=tk.X, padx=5, pady=5)
        
        ttk.Label(type_frame, text="Content Type:", font=("Arial", 12, "bold")).pack(side=tk.LEFT, padx=5)
        
        self.content_type = tk.StringVar(value="player")
        ttk.Radiobutton(type_frame, text="Player Profile", variable=self.content_type, 
                       value="player", command=self.switch_content_type).pack(side=tk.LEFT, padx=5)
        ttk.Radiobutton(type_frame, text="Guild", variable=self.content_type, 
                       value="guild", command=self.switch_content_type).pack(side=tk.LEFT, padx=5)
        ttk.Radiobutton(type_frame, text="Article", variable=self.content_type, 
                       value="article", command=self.switch_content_type).pack(side=tk.LEFT, padx=5)
        
        # Item selector
        selector_frame = ttk.Frame(parent)
        selector_frame.pack(fill=tk.X, padx=5, pady=5)
        
        ttk.Label(selector_frame, text="Select/Create:", font=("Arial", 10)).pack(side=tk.LEFT, padx=5)
        
        self.item_selector = ttk.Combobox(selector_frame, state="readonly", width=30)
        self.item_selector.pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)
        self.item_selector.bind("<<ComboboxSelected>>", self.load_selected_item)
        
        ttk.Button(selector_frame, text="New", command=self.create_new_item).pack(side=tk.LEFT, padx=2)
        ttk.Button(selector_frame, text="Delete", command=self.delete_item).pack(side=tk.LEFT, padx=2)
        
        # Scrollable form area
        form_canvas = tk.Canvas(parent, bg="white")
        scrollbar = ttk.Scrollbar(parent, orient="vertical", command=form_canvas.yview)
        self.form_frame = ttk.Frame(form_canvas)
        
        self.form_frame.bind(
            "<Configure>",
            lambda e: form_canvas.configure(scrollregion=form_canvas.bbox("all"))
        )
        
        form_canvas.create_window((0, 0), window=self.form_frame, anchor="nw")
        form_canvas.configure(yscrollcommand=scrollbar.set)
        
        form_canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5, pady=5)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Action buttons
        action_frame = ttk.Frame(parent)
        action_frame.pack(fill=tk.X, padx=5, pady=10)
        
        ttk.Button(action_frame, text="Save to JSON", command=self.save_current_item).pack(side=tk.LEFT, padx=5)
        ttk.Button(action_frame, text="Generate HTML", command=self.generate_html).pack(side=tk.LEFT, padx=5)
        ttk.Button(action_frame, text="Preview in Browser", command=self.preview_in_browser).pack(side=tk.LEFT, padx=5)
        
        # Initialize with player form
        self.switch_content_type()
        
    def create_preview_panel(self, parent):
        """Create the preview panel"""
        preview_label = ttk.Label(parent, text="Live Preview", font=("Arial", 12, "bold"))
        preview_label.pack(pady=5)
        
        # HTML preview
        self.preview_text = scrolledtext.ScrolledText(parent, wrap=tk.WORD, width=60, height=50)
        self.preview_text.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Update preview button
        ttk.Button(parent, text="Update Preview", command=self.update_preview).pack(pady=5)
        
    def switch_content_type(self):
        """Switch between player/guild/article forms"""
        # Clear existing form
        for widget in self.form_frame.winfo_children():
            widget.destroy()
            
        self.form_fields = {}
        
        content = self.content_type.get()
        
        if content == "player":
            self.create_player_form()
            self.update_item_list(self.data.get("players", []))
        elif content == "guild":
            self.create_guild_form()
            self.update_item_list(self.data.get("guilds", []))
        elif content == "article":
            self.create_article_form()
            self.update_item_list(self.data.get("articles", []))
            
    def create_player_form(self):
        """Create form for player profile"""
        fields = [
            ("ID", "id", "entry"),
            ("Name", "name", "entry"),
            ("IGN", "ign", "entry"),
            ("MaiMai Friend Code", "maimaiFriendCode", "entry"),
            ("Nickname", "nickname", "entry"),
            ("Motto", "motto", "entry"),
            ("Age", "age", "entry"),
            ("Rating", "rating", "entry"),
            ("Role", "role", "entry"),
            ("Rank", "rank", "entry"),
            ("Joined", "joined", "entry"),
            ("Bio", "bio", "text"),
            ("Guild ID", "guildId", "entry"),
        ]
        
        row = 0
        for label, key, widget_type in fields:
            ttk.Label(self.form_frame, text=label + ":", font=("Arial", 10)).grid(row=row, column=0, sticky="w", padx=5, pady=5)
            
            if widget_type == "entry":
                var = tk.StringVar()
                entry = ttk.Entry(self.form_frame, textvariable=var, width=50)
                entry.grid(row=row, column=1, sticky="ew", padx=5, pady=5)
                self.form_fields[key] = var
            elif widget_type == "text":
                text = tk.Text(self.form_frame, height=3, width=50)
                text.grid(row=row, column=1, sticky="ew", padx=5, pady=5)
                self.form_fields[key] = text
                
            row += 1
            
        # Achievements section
        ttk.Label(self.form_frame, text="Achievements (JSON):", font=("Arial", 10)).grid(row=row, column=0, sticky="nw", padx=5, pady=5)
        self.achievements_text = tk.Text(self.form_frame, height=10, width=50)
        self.achievements_text.grid(row=row, column=1, sticky="ew", padx=5, pady=5)
        self.form_fields["achievements"] = self.achievements_text
        
        self.form_frame.columnconfigure(1, weight=1)
        
    def create_guild_form(self):
        """Create form for guild"""
        fields = [
            ("ID", "id", "entry"),
            ("Name", "name", "entry"),
            ("Motto", "motto", "entry"),
            ("Member Count", "memberCount", "entry"),
            ("Level", "level", "entry"),
            ("Established", "established", "entry"),
            ("Description", "description", "text"),
        ]
        
        row = 0
        for label, key, widget_type in fields:
            ttk.Label(self.form_frame, text=label + ":", font=("Arial", 10)).grid(row=row, column=0, sticky="w", padx=5, pady=5)
            
            if widget_type == "entry":
                var = tk.StringVar()
                entry = ttk.Entry(self.form_frame, textvariable=var, width=50)
                entry.grid(row=row, column=1, sticky="ew", padx=5, pady=5)
                self.form_fields[key] = var
            elif widget_type == "text":
                text = tk.Text(self.form_frame, height=4, width=50)
                text.grid(row=row, column=1, sticky="ew", padx=5, pady=5)
                self.form_fields[key] = text
                
            row += 1
            
        # Achievements section
        ttk.Label(self.form_frame, text="Achievements (JSON):", font=("Arial", 10)).grid(row=row, column=0, sticky="nw", padx=5, pady=5)
        self.achievements_text = tk.Text(self.form_frame, height=10, width=50)
        self.achievements_text.grid(row=row, column=1, sticky="ew", padx=5, pady=5)
        self.form_fields["achievements"] = self.achievements_text
        
        self.form_frame.columnconfigure(1, weight=1)
        
    def create_article_form(self):
        """Create form for article"""
        fields = [
            ("ID", "id", "entry"),
            ("Title", "title", "entry"),
            ("Excerpt", "excerpt", "text"),
            ("Category", "category", "entry"),
            ("Author ID", "authorId", "entry"),
            ("Date", "date", "entry"),
        ]
        
        row = 0
        for label, key, widget_type in fields:
            ttk.Label(self.form_frame, text=label + ":", font=("Arial", 10)).grid(row=row, column=0, sticky="w", padx=5, pady=5)
            
            if widget_type == "entry":
                var = tk.StringVar()
                entry = ttk.Entry(self.form_frame, textvariable=var, width=50)
                entry.grid(row=row, column=1, sticky="ew", padx=5, pady=5)
                self.form_fields[key] = var
            elif widget_type == "text":
                text = tk.Text(self.form_frame, height=3, width=50)
                text.grid(row=row, column=1, sticky="ew", padx=5, pady=5)
                self.form_fields[key] = text
                
            row += 1
            
        # Content section
        ttk.Label(self.form_frame, text="Content (HTML):", font=("Arial", 10)).grid(row=row, column=0, sticky="nw", padx=5, pady=5)
        self.content_text = scrolledtext.ScrolledText(self.form_frame, height=15, width=50)
        self.content_text.grid(row=row, column=1, sticky="ew", padx=5, pady=5)
        self.form_fields["content"] = self.content_text
        
        self.form_frame.columnconfigure(1, weight=1)
        
    def update_item_list(self, items):
        """Update the item selector dropdown"""
        names = [item.get("name", item.get("title", "Unnamed")) for item in items]
        self.item_selector["values"] = names
        if names:
            self.item_selector.current(0)
            self.load_selected_item()
            
    def load_selected_item(self, event=None):
        """Load the selected item into the form"""
        content_type = self.content_type.get()
        selected_name = self.item_selector.get()
        
        if not selected_name:
            return
            
        # Find the item
        items_key = content_type + "s" if content_type != "articles" else "articles"
        items = self.data.get(items_key, [])
        
        item = None
        for i in items:
            if i.get("name", i.get("title")) == selected_name:
                item = i
                break
                
        if not item:
            return
            
        # Load data into form
        for key, widget in self.form_fields.items():
            value = item.get(key, "")
            
            if isinstance(widget, tk.StringVar):
                widget.set(str(value))
            elif isinstance(widget, (tk.Text, scrolledtext.ScrolledText)):
                widget.delete("1.0", tk.END)
                if key == "achievements" and isinstance(value, list):
                    widget.insert("1.0", json.dumps(value, indent=2, ensure_ascii=False))
                elif isinstance(value, str):
                    widget.insert("1.0", value)
                else:
                    widget.insert("1.0", str(value))
                    
        self.update_preview()
        
    def create_new_item(self):
        """Create a new item"""
        # Clear all fields
        for key, widget in self.form_fields.items():
            if isinstance(widget, tk.StringVar):
                widget.set("")
            elif isinstance(widget, (tk.Text, scrolledtext.ScrolledText)):
                widget.delete("1.0", tk.END)
                
        messagebox.showinfo("New Item", "Form cleared. Fill in the details and click 'Save to JSON'")
        
    def delete_item(self):
        """Delete the selected item"""
        if not messagebox.askyesno("Confirm Delete", "Are you sure you want to delete this item?"):
            return
            
        content_type = self.content_type.get()
        selected_name = self.item_selector.get()
        
        items_key = content_type + "s" if content_type != "articles" else "articles"
        items = self.data.get(items_key, [])
        
        # Find and remove item
        for i, item in enumerate(items):
            if item.get("name", item.get("title")) == selected_name:
                items.pop(i)
                break
                
        self.save_data()
        self.switch_content_type()
        
    def save_current_item(self):
        """Save the current form data to JSON"""
        content_type = self.content_type.get()
        
        # Gather data from form
        item_data = {}
        
        for key, widget in self.form_fields.items():
            if isinstance(widget, tk.StringVar):
                value = widget.get()
                # Convert numeric fields
                if key in ["age", "rating", "memberCount", "level"]:
                    try:
                        value = int(value) if value else 0
                    except:
                        pass
                item_data[key] = value
            elif isinstance(widget, (tk.Text, scrolledtext.ScrolledText)):
                value = widget.get("1.0", tk.END).strip()
                if key == "achievements":
                    try:
                        item_data[key] = json.loads(value) if value else []
                    except json.JSONDecodeError:
                        messagebox.showerror("Error", "Invalid JSON in achievements field")
                        return
                else:
                    item_data[key] = value
                    
        # Validate required fields
        if not item_data.get("id"):
            messagebox.showerror("Error", "ID is required")
            return
            
        # Add or update item in data
        items_key = content_type + "s" if content_type != "articles" else "articles"
        items = self.data.get(items_key, [])
        
        # Check if item exists
        existing_index = None
        for i, item in enumerate(items):
            if item.get("id") == item_data.get("id"):
                existing_index = i
                break
                
        if existing_index is not None:
            items[existing_index] = item_data
        else:
            items.append(item_data)
            
        self.data[items_key] = items
        self.save_data()
        self.switch_content_type()
        
    def update_preview(self):
        """Update the preview pane with HTML"""
        # Check if preview widget exists
        if not hasattr(self, 'preview_text'):
            return
            
        content_type = self.content_type.get()
        
        if content_type == "player":
            html = self.generate_player_preview()
        elif content_type == "guild":
            html = self.generate_guild_preview()
        elif content_type == "article":
            html = self.generate_article_preview()
        else:
            html = "<p>Select a content type</p>"
            
        self.preview_text.delete("1.0", tk.END)
        self.preview_text.insert("1.0", html)
        
    def generate_player_preview(self):
        """Generate HTML preview for player"""
        data = {}
        for key, widget in self.form_fields.items():
            if isinstance(widget, tk.StringVar):
                data[key] = widget.get()
            elif isinstance(widget, (tk.Text, scrolledtext.ScrolledText)):
                data[key] = widget.get("1.0", tk.END).strip()
                
        html = f"""
<div class="profile-header">
    <div class="profile-avatar">{data.get('name', 'N')[0]}</div>
    <div class="profile-info">
        <h2>{data.get('name', 'Player Name')}</h2>
        <p class="profile-role">{data.get('role', 'Role')}</p>
        <div class="profile-stats">
            <div><span>Rating:</span> {data.get('rating', '0')}</div>
            <div><span>Rank:</span> {data.get('rank', '-')}</div>
            <div><span>Joined:</span> {data.get('joined', '-')}</div>
        </div>
    </div>
</div>

<h3>Player Information</h3>
<div class="card">
    <p><strong>IGN:</strong> {data.get('ign', '-')}</p>
    <p><strong>MaiMai Friend Code:</strong> {data.get('maimaiFriendCode', '-')}</p>
    <p><strong>Nickname:</strong> {data.get('nickname', '-')}</p>
    <p><strong>Motto:</strong> {data.get('motto', '-')}</p>
    <p><strong>Age:</strong> {data.get('age', '-')}</p>
    <p><strong>Rating:</strong> {data.get('rating', '-')}</p>
</div>

<h3>About</h3>
<p>{data.get('bio', 'No bio provided')}</p>

<h3>Achievements</h3>
{data.get('achievements', '[]')}
"""
        return html
        
    def generate_guild_preview(self):
        """Generate HTML preview for guild"""
        data = {}
        for key, widget in self.form_fields.items():
            if isinstance(widget, tk.StringVar):
                data[key] = widget.get()
            elif isinstance(widget, (tk.Text, scrolledtext.ScrolledText)):
                data[key] = widget.get("1.0", tk.END).strip()
                
        html = f"""
<div class="profile-header">
    <div class="guild-emblem">{data.get('name', 'G')[0]}</div>
    <div class="profile-info">
        <h2>{data.get('name', 'Guild Name')}</h2>
        <p>{data.get('motto', 'Motto')}</p>
        <div class="profile-stats">
            <div><span>Members:</span> {data.get('memberCount', '0')}</div>
            <div><span>Level:</span> {data.get('level', '0')}</div>
            <div><span>Established:</span> {data.get('established', '-')}</div>
        </div>
    </div>
</div>

<h3>About the Guild</h3>
<p>{data.get('description', 'No description provided')}</p>

<h3>Achievements</h3>
{data.get('achievements', '[]')}
"""
        return html
        
    def generate_article_preview(self):
        """Generate HTML preview for article"""
        data = {}
        for key, widget in self.form_fields.items():
            if isinstance(widget, tk.StringVar):
                data[key] = widget.get()
            elif isinstance(widget, (tk.Text, scrolledtext.ScrolledText)):
                data[key] = widget.get("1.0", tk.END).strip()
                
        html = f"""
<h1>{data.get('title', 'Article Title')}</h1>
<div class="article-meta">
    <span>Category: {data.get('category', '-')}</span>
    <span>Date: {data.get('date', '-')}</span>
    <span>Author ID: {data.get('authorId', '-')}</span>
</div>

<h3>Excerpt</h3>
<p>{data.get('excerpt', 'No excerpt')}</p>

<h3>Content</h3>
<div class="article-content">
{data.get('content', 'No content')}
</div>
"""
        return html
        
    def generate_html(self):
        """Generate the full HTML file"""
        messagebox.showinfo("Generate HTML", "HTML generation will be implemented based on templates")
        
    def preview_in_browser(self):
        """Open preview in browser"""
        content_type = self.content_type.get()
        
        if content_type == "player":
            html_content = self.generate_full_player_html()
        elif content_type == "guild":
            html_content = self.generate_full_guild_html()
        else:
            html_content = self.generate_full_article_html()
            
        # Save to temp file and open
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.html', encoding='utf-8') as f:
            f.write(html_content)
            temp_path = f.name
            
        webbrowser.open('file://' + temp_path)
        
    def generate_full_player_html(self):
        """Generate complete HTML for player profile"""
        data = {}
        for key, widget in self.form_fields.items():
            if isinstance(widget, tk.StringVar):
                data[key] = widget.get()
            elif isinstance(widget, (tk.Text, scrolledtext.ScrolledText)):
                data[key] = widget.get("1.0", tk.END).strip()
                
        # Parse achievements
        try:
            achievements = json.loads(data.get('achievements', '[]'))
        except:
            achievements = []
            
        achievements_html = ""
        for ach in achievements:
            achievements_html += f"""
            <div class="achievement-badge">
                <div class="achievement-icon">{ach.get('icon', '🏆')}</div>
                <div class="achievement-name">{ach.get('name', '')}</div>
                <div class="achievement-description">{ach.get('description', '')}</div>
            </div>
            """
        
        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{data.get('name', 'Player')} - BAMACO</title>
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <main class="container">
        <div class="profile-header">
            <div class="profile-avatar">{data.get('name', 'P')[0]}</div>
            <div class="profile-info">
                <h2 class="profile-name">{data.get('name', 'Player Name')}</h2>
                <p class="profile-role">{data.get('role', 'Role')}</p>
                <div class="profile-stats">
                    <div class="profile-stat">
                        <span class="stat-label">Rating</span>
                        <span class="stat-value">{data.get('rating', '0')}</span>
                    </div>
                    <div class="profile-stat">
                        <span class="stat-label">Rank</span>
                        <span class="stat-value">{data.get('rank', '-')}</span>
                    </div>
                    <div class="profile-stat">
                        <span class="stat-label">Joined</span>
                        <span class="stat-value">{data.get('joined', '-')}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="profile-content">
            <section class="content-section">
                <h3 class="section-title">Player Information</h3>
                <div class="card">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        <div><strong>IGN:</strong><p>{data.get('ign', '-')}</p></div>
                        <div><strong>MaiMai Friend Code:</strong><p>{data.get('maimaiFriendCode', '-')}</p></div>
                        <div><strong>Nickname:</strong><p>{data.get('nickname', '-')}</p></div>
                        <div><strong>Motto:</strong><p>{data.get('motto', '-')}</p></div>
                        <div><strong>Age:</strong><p>{data.get('age', '-')}</p></div>
                        <div><strong>Rating:</strong><p>{data.get('rating', '-')}</p></div>
                    </div>
                </div>
            </section>
            
            <section class="content-section">
                <h3 class="section-title">About</h3>
                <div class="card">
                    <p>{data.get('bio', 'No bio provided')}</p>
                </div>
            </section>
            
            <section class="content-section">
                <h3 class="section-title">Achievements</h3>
                <div class="achievements-grid">
                    {achievements_html}
                </div>
            </section>
        </div>
    </main>
</body>
</html>"""
        
    def generate_full_guild_html(self):
        """Generate complete HTML for guild"""
        return "<html><body><h1>Guild Preview</h1></body></html>"
        
    def generate_full_article_html(self):
        """Generate complete HTML for article"""
        return "<html><body><h1>Article Preview</h1></body></html>"


if __name__ == "__main__":
    root = tk.Tk()
    app = BAMACOEditor(root)
    root.mainloop()
