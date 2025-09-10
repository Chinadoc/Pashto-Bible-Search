"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import type { Database } from '../types/database';

type GrammarRule = Database['public']['Tables']['grammar_rules']['Row'];

export default function GrammarPanel() {
  const [rules, setRules] = useState<GrammarRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRule, setSelectedRule] = useState<GrammarRule | null>(null);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const { data, error } = await supabase
          .from('grammar_rules')
          .select('*')
          .order('priority');

        if (error) {
          setError(error.message);
        } else {
          setRules(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load grammar rules');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading grammar rules...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-xl font-bold mb-4">قواعد گرامر پشتو</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Pashto Grammar Rules - Click on a rule to see details
      </p>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setSelectedRule(selectedRule?.id === rule.id ? null : rule)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{rule.rule_name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {rule.part_of_speech} - Priority: {rule.priority}
                </p>
              </div>
              <span className="text-sm bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                {rule.part_of_speech}
              </span>
            </div>

            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {rule.pattern_description}
            </p>

            {selectedRule?.id === rule.id && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
                <h4 className="font-medium mb-2">Transformation Rules:</h4>
                <pre className="text-sm bg-white dark:bg-gray-700 p-2 rounded overflow-auto">
                  {JSON.stringify(rule.transformation_rules, null, 2)}
                </pre>

                {rule.examples && (
                  <>
                    <h4 className="font-medium mt-4 mb-2">Examples:</h4>
                    <pre className="text-sm bg-white dark:bg-gray-700 p-2 rounded overflow-auto">
                      {JSON.stringify(rule.examples, null, 2)}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {rules.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No grammar rules found. Please check your database connection.
        </div>
      )}
    </div>
  );
}
